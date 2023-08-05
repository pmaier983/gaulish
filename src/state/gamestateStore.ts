import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { Npc, Path, Tile, City, Ship } from "schema"
import {
  OPPOSITE_DIRECTIONS,
  type DIRECTION,
  type ShipType,
} from "~/components/constants"
import { getDirectionTowardsPrevTile } from "~/utils/utils"

export interface PathComposite extends Omit<Path, "path"> {
  path: string[]
}

export interface NpcComposite extends Npc {
  path: PathComposite
  ship: ShipType
}

export interface TileComposite extends Tile {
  npc?: NpcComposite
}

export type MapObject = { [xyTileId: string]: TileComposite }

export type CityObject = { [xyTileId: string]: City }

export interface SelectedShipPath {
  previousTileId?: string
  directionLinesToDraw: DIRECTION[]
  index: number
  isLastTileInPath: boolean
}

export type SelectedShipPathObject = {
  [xyTileId: string]: SelectedShipPath
}

export interface GamestateStore {
  selectedShip?: Ship
  selectedShipPathArray: PathComposite["path"]
  selectedShipPathObject: SelectedShipPathObject

  mapArray: Tile[]
  mapObject: MapObject
  /**
   * The Clean map object contains only the Tile data
   */
  cleanMapObject: GamestateStore["mapObject"]
  cityObject: CityObject
  npcs: NpcComposite[]
}

interface GamestateStoreActions {
  setInitialMapState: (map: GamestateStore["mapArray"]) => void
  setMapObject: (map: GamestateStore["mapObject"]) => void
  setCities: (cityObject: City[]) => void
  setNpcs: (npcs: GamestateStore["npcs"]) => void

  toggleShipSelection: (ship?: Ship) => void

  restart: () => void
}

export type Gamestate = GamestateStore & GamestateStoreActions

const initialGamestate: GamestateStore = {
  selectedShipPathArray: [],
  selectedShipPathObject: {},
  cityObject: {},
  mapArray: [],
  npcs: [],
  mapObject: {},
  cleanMapObject: {},
}

export const useGamestateStore = create<Gamestate>()(
  devtools((set, get) => ({
    ...initialGamestate,

    setInitialMapState: (map) => {
      const cleanMapObject =
        map?.reduce<MapObject>((acc, tile) => {
          acc[`${tile.x}:${tile.y}`] = tile
          return acc
        }, {}) ?? {}
      return set((state) => ({
        ...state,
        mapArray: map,
        cleanMapObject: cleanMapObject,
        mapObject: cleanMapObject,
      }))
    },

    setMapObject: (map) => set((state) => ({ ...state, mapObject: map })),

    setCities: (cityArray) => {
      const cityObject = cityArray?.reduce<CityObject>((acc, cur) => {
        acc[cur.xyTileId] = cur
        return acc
      }, {})
      set((state) => ({ ...state, cityObject: cityObject }))
    },

    setNpcs: (npcs) => set((state) => ({ ...state, npcs })),

    toggleShipSelection: (ship) => {
      // Toggle selected ship off
      if (!ship || ship.id === get().selectedShip?.id) {
        return set((state) => ({
          ...state,
          selectedShip: undefined,
          selectedShipPathArray: [],
          selectedShipPathObject: {},
        }))
      }

      const citiesObject = get().cityObject

      const startingCity = Object.values(citiesObject).find(
        (city) => city.id === ship.cityId,
      )

      if (!startingCity)
        throw new Error("Could not find the city your ship is in!")

      const selectedShipPathArray = [startingCity.xyTileId]

      return set((state) => ({
        ...state,
        selectedShip: ship,
        selectedShipPathArray: selectedShipPathArray,
        selectedShipPathObject: generateSelectedShipPathObject(
          selectedShipPathArray,
        ),
      }))
    },

    restart: () => set(initialGamestate),
  })),
)

export const generateSelectedShipPathObject = (
  shipPathArray: GamestateStore["selectedShipPathArray"],
) => {
  const shipPathObject = shipPathArray.reduce<SelectedShipPathObject>(
    (acc, curTileId, i) => {
      // For the First Tile
      if (i === 0) {
        acc[curTileId] = {
      index: i,
          directionLinesToDraw: [],
          isLastTileInPath: i === shipPathArray.length - 1,
    }
    return acc
      }

      const prevTileId = shipPathArray[i - 1]

      const directionTowardsPrevTile = getDirectionTowardsPrevTile(
        curTileId,
        prevTileId,
      )

      // If we have already passed over this tile
      if (acc[curTileId]) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const currentTile = acc[curTileId]!

        acc[curTileId] = {
          ...currentTile,
          directionLinesToDraw: [
            ...currentTile.directionLinesToDraw,
            directionTowardsPrevTile,
          ],
        }
      } else {
        // If we have never seen this tile before!
        acc[curTileId] = {
          index: i,
          previousTileId: prevTileId,
          directionLinesToDraw: [directionTowardsPrevTile],
          isLastTileInPath: i === shipPathArray.length - 1,
        }
      }

      // We also need to update the previous tile to include the direction to point towards
      if (prevTileId) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const prevTile = acc[prevTileId]!

        acc[prevTileId] = {
          ...prevTile,
          directionLinesToDraw: [
            ...prevTile.directionLinesToDraw,
            OPPOSITE_DIRECTIONS[directionTowardsPrevTile],
          ],
        }
      }

      return acc
    },
    {},
  )
  return shipPathObject
}

import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { Npc, Path, Tile, City, Ship } from "schema"
import { type DIRECTION, type ShipType } from "~/components/constants"
import { getDirectionTowardsCurrentTile } from "~/utils/utils"

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
  directionTowardsCurrentTile?: DIRECTION
  index: number
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
  return shipPathArray.reduce<SelectedShipPathObject>((acc, cur, i) => {
    const prevTile = shipPathArray[i - 1]
    acc[cur] = {
      index: i,
      previousTileId: prevTile,
      directionTowardsCurrentTile: getDirectionTowardsCurrentTile(
        cur,
        prevTile,
      ),
    }
    return acc
  }, {})
}

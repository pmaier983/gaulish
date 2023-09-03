import { createWithEqualityFn } from "zustand/traditional"
import { devtools } from "zustand/middleware"

import type { Path, Tile, City, Ship } from "schema"
import { OPPOSITE_DIRECTIONS, type DIRECTION } from "~/components/constants"
import { getDirectionTowardsPrevTile, uniqueBy } from "~/utils/utils"
import { type RouterOutputs } from "~/utils/api"
import { shallow } from "zustand/shallow"

type GetUserShipsOutput = RouterOutputs["ships"]["getUsersShips"][0]

export interface ShipComposite extends GetUserShipsOutput {
  path: NonNullable<Path>
}

export type NpcComposite = RouterOutputs["map"]["getNpcs"][0]

export interface TileComposite extends Tile {
  npc?: NpcComposite
  ship?: ShipComposite
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
  selectedShipPathArray: Path["pathArray"]
  selectedShipPathObject: SelectedShipPathObject

  mapArray: Tile[]
  sailingShips: ShipComposite[]
  mapObject: MapObject
  /**
   * The Clean map object contains only the Tile data
   */
  cleanMapObject: GamestateStore["mapObject"]
  cityObject: CityObject
  npcs: RouterOutputs["map"]["getNpcs"]
}

interface GamestateStoreActions {
  setInitialMapState: (map: GamestateStore["mapArray"]) => void
  setMapObject: (map: GamestateStore["mapObject"]) => void
  setCities: (cityObject: City[]) => void
  setNpcs: (npcs: RouterOutputs["map"]["getNpcs"]) => void
  addShips: (ships: ShipComposite[]) => void
  setSailingShips: (ships: ShipComposite[]) => void

  toggleShipSelection: (ship?: Ship) => void
  handleShipPath: (someFormOfTileId?: string | string[]) => void

  restart: () => void
}

export type Gamestate = GamestateStore & GamestateStoreActions

const initialGamestate: GamestateStore = {
  selectedShipPathArray: [],
  selectedShipPathObject: {},
  cityObject: {},
  mapArray: [],
  npcs: [],
  sailingShips: [],
  mapObject: {},
  cleanMapObject: {},
}

export const useGamestateStore = createWithEqualityFn<Gamestate>()(
  devtools((set, get) => ({
    ...initialGamestate,

    setInitialMapState: (map) => {
      const cleanMapObject =
        map?.reduce<MapObject>((acc, tile) => {
          acc[`${tile.x}:${tile.y}`] = tile
          return acc
        }, {}) ?? {}
      return set({
        mapArray: map,
        cleanMapObject: cleanMapObject,
        mapObject: cleanMapObject,
      })
    },

    setMapObject: (map) => set({ mapObject: map }),

    setCities: (cityArray) => {
      const cityObject = cityArray?.reduce<CityObject>((acc, cur) => {
        // TODO: is this "overloaded" city object risky in any way? (cityXYTileId = number:number) (ctyId = number)
        // set {[cityXYTileId]: city}
        acc[cur.xyTileId] = cur
        // set {[cityId]: city}
        acc[cur.id] = cur
        return acc
      }, {})
      set({ cityObject: cityObject })
    },

    setNpcs: (npcs) => set({ npcs: npcs }),
    addShips: (newShips) => {
      const ships = get().sailingShips

      // ensure we don't get any duplicate ships
      const newShipsArray = uniqueBy([...ships, ...newShips], "id")

      return set({ sailingShips: newShipsArray })
    },

    setSailingShips: (newShips) => set({ sailingShips: newShips }),

    toggleShipSelection: (ship) => {
      // Toggle selected ship off
      if (!ship || ship.id === get().selectedShip?.id) {
        return set({
          selectedShip: undefined,
          selectedShipPathArray: [],
          selectedShipPathObject: {},
        })
      }

      const citiesObject = get().cityObject

      const startingCity = Object.values(citiesObject).find(
        (city) => city.id === ship.cityId,
      )

      if (!startingCity)
        throw new Error("Could not find the city your ship is in!")

      const selectedShipPathArray = [startingCity.xyTileId]

      return set({
        selectedShip: ship,
        selectedShipPathArray: selectedShipPathArray,
        selectedShipPathObject: generateSelectedShipPathObject(
          selectedShipPathArray,
        ),
      })
    },

    /**
     * Handle the modification of the selected ship path
     *
     * someFormOfTileId = undefined -> remove last tile from path
     * someFormOfTileId = string -> add tile to path
     * someFormOfTileId = string[] -> override path with new path
     * someFormOfTileId = [] -> cancel ship selection
     */
    handleShipPath: (someFormOfTileId) => {
      // If passed an array, override the current path!
      if (Array.isArray(someFormOfTileId)) {
        const newShipPathArray = someFormOfTileId

        return set({
          selectedShipPathArray: newShipPathArray,
          selectedShipPathObject:
            generateSelectedShipPathObject(newShipPathArray),
          // If you pass in an empty array, cancel ship selection
          selectedShip:
            someFormOfTileId.length === 0 ? undefined : get().selectedShip,
        })
      }

      // If a falsy value is passed into the array
      if (!someFormOfTileId) {
        // If there is nothing left to remove, cancel ship path selection
        if (get().selectedShipPathArray.length <= 1) {
          return set({
            selectedShipPathArray: [],
            selectedShipPathObject: {},
            selectedShip: undefined,
          })
        }

        // newShipPathArray without its last tile
        const newShipPathArray = get().selectedShipPathArray.slice(0, -1)

        // Remove the last tile from the path
        return set({
          selectedShipPathArray: newShipPathArray,
          selectedShipPathObject:
            generateSelectedShipPathObject(newShipPathArray),
        })
      }

      const newPathTile = someFormOfTileId

      if (!get().cleanMapObject.hasOwnProperty(newPathTile)) {
        throw new Error("This tile does not exist on the map!")
      }

      // If a valid new tile is passed in, add it to the ships path
      const newShipPathArray = [
        ...get().selectedShipPathArray,
        someFormOfTileId,
      ]

      return set({
        selectedShipPathArray: newShipPathArray,
        selectedShipPathObject:
          generateSelectedShipPathObject(newShipPathArray),
      })
    },

    restart: () => set(initialGamestate),
  })),
  shallow,
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

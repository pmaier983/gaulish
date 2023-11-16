import { createWithEqualityFn } from "zustand/traditional"
import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { produce } from "immer"
import equal from "fast-deep-equal"

import type { Path, Tile, City, Ship } from "schema"
import { OPPOSITE_DIRECTIONS, type Direction } from "~/components/constants"
import {
  getDirectionTowardsPrevTile,
  getNpcCurrentXYTileId,
  getShipCurrentXYTileId,
  getTilesMoved,
  getDiamondAroundXYTileId,
  uniqueBy,
} from "~/utils"
import { type RouterOutputs } from "~/utils/api"

export type ShipComposite = RouterOutputs["ships"]["getUsersShips"][0]

export type NpcComposite = RouterOutputs["map"]["getNpcs"][0]

export interface TileComposite extends Tile {
  npc?: NpcComposite
  ship?: ShipComposite
}

export type MapObject = { [xyTileId: string]: TileComposite }

export type CityObject = { [xyTileId: string]: City }

export interface SelectedShipPath {
  previousTileId?: string
  directionLinesToDraw: Direction[]
  index: number
  isLastTileInPath: boolean
}

export interface VisibleTilesObject {
  [xyTileId: string]: boolean
}

export type SelectedShipPathObject = {
  [xyTileId: string]: SelectedShipPath
}

export interface KnownTilesObject {
  [xyTileId: string]: boolean
}

export interface GamestateStoreActions {
  setInitialMapState: (map: GamestateStore["mapArray"]) => void
  calculateMapObject: () => void
  calculateVisibleTilesObject: (userId: string) => void

  setCities: (cityObject: City[]) => void
  setNpcs: (npcs: RouterOutputs["map"]["getNpcs"]) => void
  setKnownTilesObject: (knownTiles: string[]) => void

  addSailingShips: (ships: ShipComposite[]) => void
  setSailingShips: (ships: ShipComposite[]) => void

  setUserShips: (ships: ShipComposite[]) => void

  toggleShipSelection: (ship?: Ship) => void
  handleShipPath: (someFormOfTileId?: string | string[]) => void

  restart: () => void
}

export interface GamestateStore {
  selectedShip?: Ship
  selectedShipPathArray: Path["pathArray"]
  selectedShipPathObject: SelectedShipPathObject

  visibleTilesObject: VisibleTilesObject

  mapArray: Tile[]
  knownTilesObject: KnownTilesObject
  sailingShips: ShipComposite[]
  userShips: ShipComposite[]
  mapObject: MapObject
  /**
   * The Clean map object contains only the Tile data
   */
  cleanMapObject: GamestateStore["mapObject"]
  cityObject: CityObject
  cityArray: City[]
  npcs: RouterOutputs["map"]["getNpcs"]
}

const initialGamestate: GamestateStore = {
  selectedShipPathArray: [],
  selectedShipPathObject: {},
  visibleTilesObject: {},
  cityObject: {},
  cityArray: [],
  mapArray: [],
  knownTilesObject: {},
  npcs: [],
  sailingShips: [],
  userShips: [],
  mapObject: {},
  cleanMapObject: {},
}

export type Gamestate = GamestateStore & GamestateStoreActions

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

    /**
     * Called within the game loop; Calculates the map object
     *
     * Need to generate based off the clean map object to not pollute
     * the map with old state
     *
     * Mainly based off npc's and sailing ships data
     */
    calculateMapObject: () => {
      const cleanMapObject = get().cleanMapObject
      const npcs = get().npcs

      const newMapObject = produce(cleanMapObject, (draftMapObject) => {
        /**
         * Adding NPCs to the map object
         */
        npcs.forEach((npc) => {
          const {
            path: { createdAt, pathArray },
            speed,
          } = npc

          const npcXYTileId = getNpcCurrentXYTileId({
            createdAtTimeMs: createdAt?.getTime() ?? 0,
            currentTimeMs: Date.now(),
            speed,
            pathArray,
          })

          const currentTile = draftMapObject[npcXYTileId]

          if (!currentTile)
            throw new Error(
              `Tried to access a non-existent tile. Info: ${JSON.stringify(
                npc,
              )}`,
            )

          draftMapObject[npcXYTileId] = { ...currentTile, npc }
        })

        const sailingShips = get().sailingShips
        const setSailingShips = get().setSailingShips

        /**
         * Adding User Ships to the map object
         */
        sailingShips.forEach((ship) => {
          const { path, speed } = ship

          // If the ship has no path, it's not sailing!
          if (!path) return

          const { createdAt, pathArray } = path

          const tilesMoved = getTilesMoved({
            speed,
            currentTimeMs: Date.now(),
            createdAtTimeMs: createdAt?.getTime() ?? 0,
          })

          // If the ship has finished sailing, don't add it to the map object
          if (tilesMoved >= pathArray.length) {
            // Remove the ship from the ship list if it is finished sailing
            setSailingShips(
              sailingShips.filter((currentShip) => currentShip.id !== ship.id),
            )
            return
          }

          const shipXYTileId = pathArray[tilesMoved]

          if (!shipXYTileId)
            throw new Error(
              `Math is wrong when calculating shipXYTileId. Info: ${JSON.stringify(
                ship,
              )}`,
            )

          const currentTile = draftMapObject[shipXYTileId]

          if (!currentTile)
            throw new Error(
              `Tried to access a non-existent tile. Info: ${JSON.stringify(
                ship,
              )}`,
            )
          draftMapObject[shipXYTileId] = { ...currentTile, ship }
        })
      })

      // Update nothing if the new map object is the same as the old one
      if (equal(newMapObject, get().mapObject)) return

      set({ mapObject: newMapObject })
    },

    /**
     * Called within the game loop; Calculate which tiles are visible to the user
     *
     * - use city data & user sailingShip Data
     */
    calculateVisibleTilesObject: (userId: string) => {
      const sailingShips = get().sailingShips
      const userShips = get().userShips
      const cityObject = get().cityObject
      const mapObject = get().mapObject

      const userShipsNotSailing = userShips.filter(
        (userShip) =>
          !sailingShips.some((sailingShip) => sailingShip.id === userShip.id),
      )

      const shipVisibleXYTileIds = [
        ...sailingShips.filter((ship) => ship.userId === userId),
        ...userShipsNotSailing,
      ].reduce<string[]>((XYtileIds, ship) => {
        const xyTileId = getShipCurrentXYTileId({
          ship,
          cityObject,
        })

        const newVisibleXYTileIds = getDiamondAroundXYTileId({
          xyTileId,
          tileListObject: mapObject,
          tileRadius: 3,
        })

        return [...XYtileIds, ...newVisibleXYTileIds]
      }, [])

      // TODO: at some point in the future consider adding default city visibility?
      // const cityVisibleXYTileIds = cityArray.reduce<string[]>(
      //   (XYtileIds, city) => {
      //     const newVisibleXYTileIds = getDiamondAroundXYTileId({
      //       xyTileId: city.xyTileId,
      //       tileListObject: mapObject,
      //       tileRadius: 2,
      //     })

      //     return [...XYtileIds, ...newVisibleXYTileIds]
      //   },
      //   [],
      // )

      const deduplicatedVisibleXYTileIds = [
        ...new Set([...shipVisibleXYTileIds]),
      ]

      const newVisibleTilesObject =
        deduplicatedVisibleXYTileIds.reduce<VisibleTilesObject>(
          (acc, xyTileId) => {
            acc[xyTileId] = true
            return acc
          },
          {},
        )

      // Update nothing if the new visible tiles object is the same as the old one
      if (equal(newVisibleTilesObject, get().visibleTilesObject)) return

      set({ visibleTilesObject: newVisibleTilesObject })
    },

    setCities: (cityArray) => {
      const cityObject = cityArray?.reduce<CityObject>((acc, cur) => {
        // TODO: is this "overloaded" city object risky in any way? (cityXYTileId = number:number) (ctyId = number)
        // set {[cityXYTileId]: city}
        acc[cur.xyTileId] = cur
        // set {[cityId]: city}
        acc[cur.id] = cur
        return acc
      }, {})
      set({ cityObject: cityObject, cityArray })
    },

    setNpcs: (npcs) => set({ npcs: npcs }),

    setKnownTilesObject: (newKnownTiles) => {
      const newKnownTilesObject = newKnownTiles.reduce<KnownTilesObject>(
        (acc, knownTile) => {
          acc[knownTile] = true
          return acc
        },
        {},
      )

      // Update nothing if the new known tiles object is the same as the old one
      if (equal(newKnownTilesObject, get().knownTilesObject)) return

      return set({ knownTilesObject: newKnownTilesObject })
    },

    addSailingShips: (newShips) => {
      const ships = get().sailingShips

      // ensure we don't get any duplicate ships
      const newShipsArray = uniqueBy([...ships, ...newShips], "id")

      return set({ sailingShips: newShipsArray })
    },

    setSailingShips: (newShips) => set({ sailingShips: newShips }),

    setUserShips: (newShips) => set({ userShips: newShips }),

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

import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { Npc, Path, Tile, City, Ship } from "schema"
import { type ShipType } from "~/components/constants"

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

export type MapObject = { [key: string]: TileComposite }

export type CityObject = { [key: string]: City }

export interface GamestateStore {
  selectedShip?: Ship
  selectedShipPath: PathComposite["path"]

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
  setMap: (map: GamestateStore["mapArray"]) => void
  setCities: (cityObject: City[]) => void
  setNpcs: (npcs: GamestateStore["npcs"]) => void

  selectShip: (ship: Ship) => void

  restart: () => void
}

export type Gamestate = GamestateStore & GamestateStoreActions

const initialGamestate: GamestateStore = {
  selectedShipPath: [],
  cityObject: {},
  mapArray: [],
  npcs: [],
  mapObject: {},
  cleanMapObject: {},
}

export const useGamestateStore = create<Gamestate>()(
  devtools((set, get) => ({
    ...initialGamestate,

    setMap: (map) => {
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

    setCities: (cityArray) => {
      const cityObject = cityArray?.reduce<CityObject>((acc, cur) => {
        acc[cur.xyTileId] = cur
        return acc
      }, {})
      set((state) => ({ ...state, cityObject: cityObject }))
    },

    setNpcs: (npcs) => set((state) => ({ ...state, npcs })),

    selectShip: (ship) => {
      const citiesObject = get().cityObject

      const startingCity = Object.values(citiesObject).find(
        (city) => city.id === ship.cityId,
      )

      if (!startingCity)
        throw new Error("Could not find the city your ship is in!")

      return set((state) => ({
        ...state,
        selectedShip: ship,
        selectedShipPath: [startingCity.xyTileId],
      }))
    },

    restart: () => set(initialGamestate),
  })),
)

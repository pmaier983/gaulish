import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type { Npc, Path, Tile, City } from "schema"
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
  setMapArray: (map: GamestateStore["mapArray"]) => void
  setMapObject: (map: GamestateStore["mapObject"]) => void
  setCities: (cityObject: GamestateStore["cityObject"]) => void
  setNpcs: (npcs: GamestateStore["npcs"]) => void
  setCleanMapObject: (map: GamestateStore["cleanMapObject"]) => void
  restart: () => void
}

export type Gamestate = GamestateStore & GamestateStoreActions

const initialGamestate: GamestateStore = {
  cityObject: {},
  mapArray: [],
  npcs: [],
  mapObject: {},
  cleanMapObject: {},
}

export const useGamestateStore = create<Gamestate>()(
  devtools((set) => ({
    ...initialGamestate,

    setMapArray: (mapArray) => set((state) => ({ ...state, mapArray })),
    setMapObject: (mapObject) => set((state) => ({ ...state, mapObject })),
    setCities: (cityObject) => {
      return set((state) => ({ ...state, cityObject }))
    },
    setNpcs: (npcs) => set((state) => ({ ...state, npcs })),
    setCleanMapObject: (cleanMapObject) =>
      set((state) => ({ ...state, cleanMapObject })),

    restart: () => set(initialGamestate),
  })),
)

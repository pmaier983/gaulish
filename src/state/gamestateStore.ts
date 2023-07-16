import { type ShipType, type Npc, type Path, type Tile } from "schema"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

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

export interface GamestateStore {
  mapArray: Tile[]
  mapObject: MapObject
  /**
   * The Clean map object contains only the Tile data
   */
  cleanMapObject: GamestateStore["mapObject"]
  npcs: NpcComposite[]
}

interface GamestateStoreActions {
  setNpcs: (npcs: GamestateStore["npcs"]) => void
  setMapArray: (map: GamestateStore["mapArray"]) => void
  setMapObject: (map: GamestateStore["mapObject"]) => void
  setCleanMapObject: (map: GamestateStore["cleanMapObject"]) => void
  restart: () => void
}

export type Gamestate = GamestateStore & GamestateStoreActions

const initialGamestate: GamestateStore = {
  mapArray: [],
  npcs: [],
  mapObject: {},
  cleanMapObject: {},
}

export const useGamestateStore = create<Gamestate>()(
  devtools((set) => ({
    ...initialGamestate,

    setNpcs: (npcs) => set((state) => ({ ...state, npcs })),
    setMapArray: (mapArray) => set((state) => ({ ...state, mapArray })),
    setMapObject: (mapObject) => set((state) => ({ ...state, mapObject })),
    setCleanMapObject: (cleanMapObject) =>
      set((state) => ({ ...state, cleanMapObject })),

    restart: () => set(initialGamestate),
  })),
)

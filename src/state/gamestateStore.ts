import { type Npc, type Path, type Tile } from "schema"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface GamestateStore {
  map: Tile[]
  npcs: {
    npc: Npc
    path: Path
  }[]
}

interface GamestateStoreActions {
  setNpcs: (npcs: GamestateStore["npcs"]) => void
  setMap: (map: GamestateStore["map"]) => void
  restart: () => void
}

export type Gamestate = GamestateStore & GamestateStoreActions

const initialGamestate: GamestateStore = {
  map: [],
  npcs: [],
}

export const useGamestateStore = create<Gamestate>()(
  devtools((set) => ({
    ...initialGamestate,
    setNpcs: (npcs) => set((state) => ({ ...state, npcs })),
    setMap: (map) => set((state) => ({ ...state, map })),
    restart: () => set(initialGamestate),
  })),
)

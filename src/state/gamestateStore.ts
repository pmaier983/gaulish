import { type Tile } from "schema"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface GamestateStore {
  map: Tile[]
}

interface GamestateStoreActions {
  setMap: (map: GamestateStore["map"]) => void
  restart: () => void
}

export type Gamestate = GamestateStore & GamestateStoreActions

const initialGamestate: GamestateStore = {
  map: [],
}

export const useGamestateStore = create<Gamestate>()(
  devtools((set) => ({
    ...initialGamestate,
    setMap: (map) => set((state) => ({ ...state, map })),
    restart: () => set(initialGamestate),
  })),
)

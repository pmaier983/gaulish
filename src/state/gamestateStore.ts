import { type Tile } from "schema"
import { create } from "zustand"
import { devtools } from "zustand/middleware"

export interface CityStateContent {
  map: Tile[][]
}

interface CityStateActions {
  setMap: (map: Tile[][]) => void
  restart: () => void
}

export type CityState = CityStateContent & CityStateActions

const initialCityState: CityStateContent = {
  map: [],
}

export const useCityStore = create<CityState>()(
  devtools((set) => ({
    ...initialCityState,
    restart: () => set(initialCityState),
    setMap: (map) => set((state) => ({ ...state, map })),
  })),
)

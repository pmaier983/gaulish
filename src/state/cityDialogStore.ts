import { createWithEqualityFn } from "zustand/traditional"
import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"
import { type City } from "schema"

export const CITY_DIALOG_INTERFACES = {
  SHIPS: "SHIPS",
  TRADE: "TRADE",
  EXCHANGE: "EXCHANGE",
  DOCKYARD: "DOCKYARD",
} as const

export type CityDialogInterface = keyof typeof CITY_DIALOG_INTERFACES

interface CityDialogStoreActions {
  restart: () => void

  toggleOpenState: (newOpenState?: boolean) => void
}

export interface CityDialogStore {
  isOpen: boolean

  selectedCity?: City
  cityDialogInterface: CityDialogInterface
}

const initialCityDialogStoreState: CityDialogStore = {
  isOpen: false,

  cityDialogInterface: "SHIPS",
}

export type CityDialogStoreState = CityDialogStore & CityDialogStoreActions

export const useCityDialogStore = createWithEqualityFn<CityDialogStoreState>()(
  devtools((set) => ({
    ...initialCityDialogStoreState,

    toggleOpenState: (newOpenState) => {
      if (newOpenState !== undefined) {
        set(() => ({ isOpen: newOpenState }))
      } else {
        set((state) => ({ isOpen: !state.isOpen }))
      }
    },

    restart: () => {},
  })),
  shallow,
)

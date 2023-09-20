import { createWithEqualityFn } from "zustand/traditional"
import { devtools } from "zustand/middleware"
import { shallow } from "zustand/shallow"

export const CITY_DIALOG_INTERFACES = {
  SHIPS: "SHIPS",
  TRADE: "TRADE",
  EXCHANGE: "EXCHANGE",
  DOCKYARD: "DOCKYARD",
} as const

export type CityDialogInterface = keyof typeof CITY_DIALOG_INTERFACES

export interface CityDialogStoreActions {
  restart: () => void

  shipTradeClick: () => void
  shipExchangeClick: () => void

  setCityDialogInterface: (newInterface: CityDialogInterface) => void

  toggleOpenState: (newOpenState?: boolean) => void
  toggleSelectedCityId: (newSelectedCityId?: number) => void
}

export interface CityDialogStore {
  isOpen: boolean

  selectedCityId?: number
  cityDialogInterface: CityDialogInterface
}

const initialCityDialogStoreState: CityDialogStore = {
  isOpen: false,

  cityDialogInterface: "SHIPS",
}

export type CityDialogStoreState = CityDialogStore & CityDialogStoreActions

export const useCityDialogStore = createWithEqualityFn<CityDialogStoreState>()(
  devtools((set, get) => ({
    ...initialCityDialogStoreState,

    shipTradeClick: () => {
      set({ cityDialogInterface: "TRADE", isOpen: true })
    },

    shipExchangeClick: () => {
      set({ cityDialogInterface: "EXCHANGE", isOpen: true })
    },

    setCityDialogInterface: (newInterface) => {
      set({ cityDialogInterface: newInterface })
    },

    toggleOpenState: (newOpenState) => {
      if (newOpenState !== undefined) {
        set(() => ({ isOpen: newOpenState }))
      } else {
        set((state) => ({ isOpen: !state.isOpen }))
      }
    },

    toggleSelectedCityId: (newSelectedCityId) => {
      // when selecting a city that is already selected, unselect the city
      if (newSelectedCityId === get().selectedCityId) {
        set({ selectedCityId: undefined })
      } else {
        set({ selectedCityId: newSelectedCityId })
      }
    },

    restart: () => {},
  })),
  shallow,
)

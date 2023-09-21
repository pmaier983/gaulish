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

  toggleOpenState: (newOpenState?: boolean) => void
  setCityDialogInterface: (newInterface: CityDialogInterface) => void

  shipTradeClick: () => void
  shipExchangeClick: () => void

  toggleSelectedCityId: (newSelectedCityId?: number) => void
  toggleSelectedTradeShipId: (newSelectedTradeShipId?: string) => void

  addSelectedExchangeShipId: (newSelectedExchangeShipId: string) => void
  removeSelectedExchangeShipId: (newSelectedExchangeShipId: string) => void
}

export interface CityDialogStore {
  isOpen: boolean

  selectedCityId?: number
  selectedTradeShipId?: string

  selectedExchangeShipIds: string[]

  cityDialogInterface: CityDialogInterface
}

const initialCityDialogStoreState: CityDialogStore = {
  isOpen: false,

  cityDialogInterface: "SHIPS",

  selectedExchangeShipIds: [],
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

    toggleSelectedTradeShipId: (newSelectedTradeShipId) => {
      // when selecting a ship that is already selected, unselect the ship
      if (newSelectedTradeShipId === get().selectedTradeShipId) {
        set({ selectedTradeShipId: undefined })
      } else {
        set({ selectedTradeShipId: newSelectedTradeShipId })
      }
    },

    addSelectedExchangeShipId: (newSelectedExchangeShipId: string) => {
      const currentSelectedExchangeShipIds = get().selectedExchangeShipIds

      // Replace the second ship when adding a third ship
      if (currentSelectedExchangeShipIds.length >= 2) {
        const [firstShipId] = currentSelectedExchangeShipIds
        set({
          selectedExchangeShipIds: [firstShipId!, newSelectedExchangeShipId],
        })
      } else {
        // Otherwise just shove the new shipId onto the array
        set({
          selectedExchangeShipIds: [
            ...currentSelectedExchangeShipIds,
            newSelectedExchangeShipId,
          ],
        })
      }
    },

    removeSelectedExchangeShipId: (newSelectedExchangeShipId: string) => {
      const currentSelectedExchangeShipIds = get().selectedExchangeShipIds

      set({
        selectedExchangeShipIds: currentSelectedExchangeShipIds.filter(
          (shipId) => shipId !== newSelectedExchangeShipId,
        ),
      })
    },

    restart: () => {},
  })),
  shallow,
)

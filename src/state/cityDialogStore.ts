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

  shipTradeClick: ({
    newTradeShipId,
  }: {
    newTradeShipId?: string
    newSelectedCityId?: number
  }) => void
  shipExchangeClick: ({
    newExchangeShipId,
    side,
  }: {
    newExchangeShipId?: string
    side?: "LEFT" | "RIGHT"
  }) => void

  toggleSelectedCityId: (newSelectedCityId?: number) => void
  toggleSelectedTradeShipId: (newSelectedTradeShipId?: string) => void
}

export interface CityDialogStore {
  isOpen: boolean

  selectedCityId?: number
  selectedTradeShipId?: string

  selectedExchangeShipIdLeft?: string
  selectedExchangeShipIdRight?: string

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

    shipTradeClick: ({ newTradeShipId, newSelectedCityId }) => {
      set({
        cityDialogInterface: "TRADE",
        isOpen: true,
        selectedTradeShipId: newTradeShipId,
        selectedCityId:
          newSelectedCityId !== undefined
            ? newSelectedCityId
            : get().selectedCityId,
      })
    },

    shipExchangeClick: ({ newExchangeShipId, side }) => {
      // If a side is, add the ship to the specified side
      if (typeof side === "string") {
        if (side === "LEFT") {
          set({
            cityDialogInterface: "EXCHANGE",
            isOpen: true,
            selectedExchangeShipIdLeft: newExchangeShipId,
          })
        } else {
          set({
            cityDialogInterface: "EXCHANGE",
            isOpen: true,
            selectedExchangeShipIdRight: newExchangeShipId,
          })
        }
        // Otherwise default to the left side and remove any other ship
      } else {
        set({
          cityDialogInterface: "EXCHANGE",
          isOpen: true,
          selectedExchangeShipIdLeft: newExchangeShipId,
          selectedExchangeShipIdRight: undefined,
        })
      }
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

      set({ selectedTradeShipId: undefined })
    },

    toggleSelectedTradeShipId: (newSelectedTradeShipId) => {
      // when selecting a ship that is already selected, unselect the ship
      if (newSelectedTradeShipId === get().selectedTradeShipId) {
        set({ selectedTradeShipId: undefined })
      } else {
        set({ selectedTradeShipId: newSelectedTradeShipId })
      }
    },

    restart: () => {},
  })),
  shallow,
)

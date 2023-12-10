import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"
import { devtools } from "zustand/middleware"

import type { MapCreationMode } from "~/components/map/MapCreation/constants"
import type { Tile } from "schema"
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "~/hooks/useLocalStorage"
import { createCreationMap } from "~/components/map/MapCreation/utils"

export const MAP_TOPPING_ACTIONS = {
  ADD_NPC: "ADD_NPC",
}

export type MapToppingAction = keyof typeof MAP_TOPPING_ACTIONS | undefined

export interface MapCreationStoreState {
  mapCreationMode: MapCreationMode
  mapToppingAction: MapToppingAction

  mapArray: Tile[]
  mapWidth: number
  mapHeight: number
}

interface MapCreationStoreActions {
  restart: () => void

  setMapArray: (mapArray: Tile[]) => void
  setMapCreationMode: (mode: MapCreationMode) => void
  setMapSize: (width: number, height: number) => void

  setMapToppingAction: (action: MapToppingAction) => void
}

export type MapCreationStore = MapCreationStoreActions & MapCreationStoreState

const storedMapArray = getLocalStorageValue<Tile[]>("STORED_MAP_ARRAY", [])

const initialMapCreationState: MapCreationStoreState = {
  mapCreationMode: storedMapArray.length > 0 ? "MAP_TOPPINGS" : "MAP_CREATION",

  mapArray: storedMapArray,
  mapToppingAction: undefined,

  mapWidth: storedMapArray.reduce((acc, tile) => Math.max(acc, tile.x), 0),
  mapHeight: storedMapArray.reduce((acc, tile) => Math.max(acc, tile.y), 0),
}

export const useMapCreationStore = createWithEqualityFn<MapCreationStore>()(
  devtools((set) => ({
    ...initialMapCreationState,

    setMapArray: (mapArray) => {
      setLocalStorageValue("STORED_MAP_ARRAY", mapArray)
      set({ mapArray })
    },

    setMapCreationMode: (mode) => set({ mapCreationMode: mode }),

    setMapSize: (mapWidth, mapHeight) => {
      const newDevMap = createCreationMap({
        width: mapWidth,
        height: mapHeight,
      })

      set({ mapWidth, mapHeight, mapArray: newDevMap })
    },

    setMapToppingAction: (mapToppingAction) => set({ mapToppingAction }),

    restart: () => set(initialMapCreationState),
  })),
  shallow,
)

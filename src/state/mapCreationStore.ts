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

export interface MapCreationStoreState {
  mapCreationMode: MapCreationMode

  mapArray: Tile[]
  mapWidth: number
  mapHeight: number
}

interface MapCreationStoreActions {
  restart: () => void

  setMapArray: (mapArray: Tile[]) => void
  setMapCreationMode: (mode: MapCreationMode) => void
  setMapSize: (width: number, height: number) => void
}

export type MapCreationStore = MapCreationStoreActions & MapCreationStoreState

const initialMapCreationState: MapCreationStoreState = {
  mapCreationMode: "MAP_CREATION",

  mapArray: getLocalStorageValue<Tile[]>("STORED_MAP_ARRAY", []),

  mapWidth: 0,
  mapHeight: 0,
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

    restart: () => set(initialMapCreationState),
  })),
  shallow,
)

import { shallow } from "zustand/shallow"
import { createWithEqualityFn } from "zustand/traditional"
import { devtools } from "zustand/middleware"

import type { MapCreationMode } from "~/components/map/MapCreation/constants"
import { type Path, type Tile, type Npc } from "schema"
import {
  getLocalStorageValue,
  setLocalStorageValue,
} from "~/hooks/useLocalStorage"
import { createCreationMap } from "~/components/map/MapCreation/utils"
import {
  SHIP_TYPE_TO_SHIP_PROPERTIES,
  type ShipType,
} from "~/components/constants"

export const MAP_TOPPING_ACTIONS = {
  ADD_NPC: "ADD_NPC",
}

export type MapToppingAction = keyof typeof MAP_TOPPING_ACTIONS | undefined

export interface StoredNpc extends Omit<Npc, "pathId"> {
  pathArray: Path["pathArray"]
}

export interface MapCreationStoreState {
  mapCreationMode: MapCreationMode
  mapToppingAction: MapToppingAction

  mapArray: Tile[]
  mapWidth: number
  mapHeight: number

  npcPathArray: Path["pathArray"]
  currentNpcShipType?: ShipType
  npcs: StoredNpc[]
}

interface MapCreationStoreActions {
  restart: () => void

  setMapArray: (mapArray: Tile[]) => void
  setMapCreationMode: (mode: MapCreationMode) => void
  setMapSize: (width: number, height: number) => void

  startAddNpcToppingAction: ({
    initialXYTileId,
    shipType,
  }: {
    initialXYTileId: string
    shipType: ShipType
  }) => void
  addToNpcPath: (newXYTileId: string) => void
  removeFromNpcPath: () => void
  cancelToppingAction: () => void

  submitAddNpcToppingAction: () => void
  removeNpc: (npcId: number) => void
}

export type MapCreationStore = MapCreationStoreActions & MapCreationStoreState

const storedMapArray = getLocalStorageValue<Tile[]>("STORED_MAP_ARRAY", [])

const initialMapCreationState: MapCreationStoreState = {
  mapCreationMode: storedMapArray.length > 0 ? "MAP_TOPPINGS" : "MAP_CREATION",
  mapToppingAction: undefined,

  mapArray: storedMapArray,
  mapWidth: storedMapArray.reduce((acc, tile) => Math.max(acc, tile.x), 0),
  mapHeight: storedMapArray.reduce((acc, tile) => Math.max(acc, tile.y), 0),

  npcPathArray: [],
  currentNpcShipType: undefined,
  npcs: getLocalStorageValue<StoredNpc[]>("STORED_MAP_NPC", []),
}

export const useMapCreationStore = createWithEqualityFn<MapCreationStore>()(
  devtools((set, get) => ({
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

    startAddNpcToppingAction: ({ initialXYTileId, shipType }) => {
      set({
        mapToppingAction: "ADD_NPC",
        npcPathArray: [initialXYTileId],
        currentNpcShipType: shipType,
      })
    },

    addToNpcPath: (newPathXYTileId) => {
      set({ npcPathArray: [...get().npcPathArray, newPathXYTileId] })
    },

    removeFromNpcPath: () => {
      const npcPathArray = get().npcPathArray
      const npcPathArrayLessLastItem = npcPathArray.slice(
        0,
        npcPathArray.length - 1,
      )
      set({ npcPathArray: npcPathArrayLessLastItem })
    },

    submitAddNpcToppingAction: () => {
      const currentNpcShipType = get().currentNpcShipType

      if (!currentNpcShipType) {
        console.error("Cannot submit NPC topping action without a ShipType")
        return
      }

      const currentNpcs = get().npcs

      const newNpc: StoredNpc = {
        id: currentNpcs.length + 1,
        shipType: currentNpcShipType,
        pathArray: get().npcPathArray,
        name: `Enemy ${currentNpcShipType}`,
        speed: SHIP_TYPE_TO_SHIP_PROPERTIES[currentNpcShipType].speed,
      }

      const newNpcs = [...currentNpcs, newNpc]

      setLocalStorageValue<StoredNpc[]>("STORED_MAP_NPC", newNpcs)

      set({
        mapToppingAction: undefined,
        npcPathArray: [],
        currentNpcShipType: undefined,
        npcs: newNpcs,
      })
    },

    removeNpc: (npcId) => {
      const npcs = get().npcs

      const newNpcs = npcs.filter((npc) => npc.id !== npcId)

      setLocalStorageValue<StoredNpc[]>("STORED_MAP_NPC", newNpcs)

      set({ npcs: newNpcs })
    },

    cancelToppingAction: () => {
      set({
        mapToppingAction: undefined,
        npcPathArray: [],
        currentNpcShipType: undefined,
      })
    },

    restart: () => set(initialMapCreationState),
  })),
  shallow,
)

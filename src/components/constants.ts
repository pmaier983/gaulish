import { type NextRouter } from "next/router"

export const AUTH_FREE_PAGES: NextRouter["pathname"][] = ["/"]

export const TILE_PERCENT_SIZE = 0.05

export const FONT_PERCENT_SIZE = 0.2

export const CHANNELS = {
  MESSAGE: "MESSAGE",
} as const

export const TILE_TYPES = {
  EMPTY: "EMPTY",
  FOREST: "FOREST",
  GRASSLAND: "GRASSLAND",
  MOUNTAIN: "MOUNTAIN",
  OCEAN: "OCEAN",
} as const

export const TILE_TYPE_ID_TO_TYPE = {
  0: TILE_TYPES.EMPTY,
  1: TILE_TYPES.FOREST,
  2: TILE_TYPES.GRASSLAND,
  3: TILE_TYPES.MOUNTAIN,
  4: TILE_TYPES.OCEAN,
}

export const TILE_TYPE_TO_TYPE_ID = {
  [TILE_TYPES.EMPTY]: 0,
  [TILE_TYPES.FOREST]: 1,
  [TILE_TYPES.GRASSLAND]: 2,
  [TILE_TYPES.MOUNTAIN]: 3,
  [TILE_TYPES.OCEAN]: 4,
}

export type TILE_TYPE = keyof typeof TILE_TYPES

export const SHIP_TYPES = {
  PLANK: 0,
  RAFT: 1,
}

export interface ShipType {
  shipTypeId: number
  name: string
  cargo_capacity: number
  speed: number
}

export const SHIP_ID_TO_SHIP_TYPES: { [key: number]: ShipType } = {
  [SHIP_TYPES.PLANK]: {
    shipTypeId: SHIP_TYPES.PLANK,
    name: "plank",
    cargo_capacity: 1,
    speed: 1 / 5000, // 1 tile every 5 seconds
  },
  [SHIP_TYPES.RAFT]: {
    shipTypeId: SHIP_TYPES.RAFT,
    name: "raft",
    cargo_capacity: 10,
    speed: 1 / 2500, // 1 tile every 2.5 seconds
  },
}

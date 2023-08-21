import { type NextRouter } from "next/router"

export const AUTH_FREE_PAGES: NextRouter["pathname"][] = ["/"]

export const TILE_PERCENT_SIZE = 0.05

export const FONT_PERCENT_SIZE = 0.2

export const CHANNELS = {
  MESSAGE: "MESSAGE",
  SAILING: "SAILING",
} as const

export const TILE_TYPES = {
  EMPTY: "EMPTY",
  FOREST: "FOREST",
  GRASSLAND: "GRASSLAND",
  MOUNTAIN: "MOUNTAIN",
  OCEAN: "OCEAN",
} as const

export const DIRECTIONS = {
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  EAST: "EAST",
  WEST: "WEST",
} as const

export type DIRECTION = keyof typeof DIRECTIONS

export const OPPOSITE_DIRECTIONS = {
  [DIRECTIONS.NORTH]: DIRECTIONS.SOUTH,
  [DIRECTIONS.SOUTH]: DIRECTIONS.NORTH,
  [DIRECTIONS.EAST]: DIRECTIONS.WEST,
  [DIRECTIONS.WEST]: DIRECTIONS.EAST,
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

export interface ShipProperties {
  shipType: string
  cargoCapacity: number
  speed: number
}

export const SHIP_TYPES = {
  PLANK: "PLANK",
  RAFT: "RAFT",
}

export type ShipType = keyof typeof SHIP_TYPES

export const SHIP_TYPE_TO_SHIP_PROPERTIES: { [key: string]: ShipProperties } = {
  [SHIP_TYPES.PLANK]: {
    shipType: SHIP_TYPES.PLANK,
    cargoCapacity: 1,
    speed: 1 / 1000, // 1 tile every second
  },
  [SHIP_TYPES.RAFT]: {
    shipType: SHIP_TYPES.RAFT,
    cargoCapacity: 10,
    speed: 1 / 2500, // 1 tile every 2.5 seconds
  },
}

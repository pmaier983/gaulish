import { type NextRouter } from "next/router"

export const AUTH_FREE_PAGES: NextRouter["pathname"][] = ["/"]

export const TILE_SIZE = 32

export const TILE_GROUP_SIZE = 8

export const FONT_PERCENT_SIZE = 0.2

export const LOG_PAGE_SIZE = 10

export const MAX_SHIP_NAME_LENGTH = 20

export const PRICE_UPDATE_INTERVAL = 1000 * 60 * 5 // every 5 minutes

export const FAKE_INITIAL_SHIP_PATH_ID = "FAKE_INITIAL_SHIP_PATH_ID"

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
  DESERT: "DESERT",
  GRAVEL: "GRAVEL",
  SNOW: "SNOW",
  LAVA: "LAVA",
} as const

export const TILE_TYPES_TO_LOWERCASE = {
  [TILE_TYPES.EMPTY]: "empty",
  [TILE_TYPES.FOREST]: "forest",
  [TILE_TYPES.GRASSLAND]: "grassland",
  [TILE_TYPES.MOUNTAIN]: "mountain",
  [TILE_TYPES.OCEAN]: "ocean",
  [TILE_TYPES.DESERT]: "desert",
  [TILE_TYPES.GRAVEL]: "gravel",
  [TILE_TYPES.SNOW]: "snow",
  [TILE_TYPES.LAVA]: "lava",
} as const satisfies { [key in TileType]: string }

export interface ColorData {
  r: number
  g: number
  b: number
}

// Colors from this pallet: https://www.pixilart.com/palettes/tiles-advances-79993
export const TILE_TYPES_TO_RGB = {
  [TILE_TYPES.EMPTY]: { r: 255, g: 255, b: 255 }, // #FFFFFF
  [TILE_TYPES.FOREST]: { r: 36, g: 97, b: 21 }, // #246115
  [TILE_TYPES.GRASSLAND]: { r: 99, g: 176, b: 52 }, // #63B034
  [TILE_TYPES.MOUNTAIN]: { r: 122, g: 122, b: 122 }, // #7A7A7A
  [TILE_TYPES.OCEAN]: { r: 46, g: 65, b: 240 }, // #2E41F0
  [TILE_TYPES.DESERT]: { r: 217, g: 209, b: 159 }, // #D9D19F
  [TILE_TYPES.GRAVEL]: { r: 87, g: 85, b: 83 }, // #575553
  [TILE_TYPES.SNOW]: { r: 236, g: 247, b: 246 }, // #ECF7F6
  [TILE_TYPES.LAVA]: { r: 203, g: 86, b: 16 }, // #CB5610
} as const satisfies { [key in TileType]: ColorData }

export const RGB_TO_TILE_TYPE = (
  Object.entries(TILE_TYPES_TO_RGB) as [TileType, ColorData][]
).reduce<{
  [key: string]: TileType
}>((acc, [tileType, rgbColor]) => {
  const key = Object.values(rgbColor).join(":")
  acc[key] = tileType
  return acc
}, {})

export type TileType = keyof typeof TILE_TYPES

export const DIRECTIONS = {
  NORTH: "NORTH",
  SOUTH: "SOUTH",
  EAST: "EAST",
  WEST: "WEST",
} as const

export type Direction = keyof typeof DIRECTIONS

export const OPPOSITE_DIRECTIONS = {
  [DIRECTIONS.NORTH]: DIRECTIONS.SOUTH,
  [DIRECTIONS.SOUTH]: DIRECTIONS.NORTH,
  [DIRECTIONS.EAST]: DIRECTIONS.WEST,
  [DIRECTIONS.WEST]: DIRECTIONS.EAST,
} as const

export const SHIP_TYPES = {
  PLANK: "PLANK",
  RAFT: "RAFT",
  SLOOP: "SLOOP",
  LONGSHIP: "LONGSHIP",
  FRIGATE: "FRIGATE",
} as const

export type ShipType = keyof typeof SHIP_TYPES

export interface ShipProperties {
  shipType: ShipType
  cargoCapacity: number
  speed: number
  attack: number
  defense: number
  price: number
}

// TODO: balancing
export const SHIP_TYPE_TO_SHIP_PROPERTIES: {
  [key in ShipType]: ShipProperties
} = {
  [SHIP_TYPES.PLANK]: {
    shipType: SHIP_TYPES.PLANK,
    cargoCapacity: 5,
    speed: 1 / 2500,
    attack: 0,
    defense: 10000,
    price: 0,
  },
  [SHIP_TYPES.RAFT]: {
    shipType: SHIP_TYPES.RAFT,
    cargoCapacity: 10,
    speed: 1 / 2300, // 1 tile every 2.5 seconds
    attack: 500,
    defense: 500,
    price: 100,
  },
  [SHIP_TYPES.SLOOP]: {
    shipType: SHIP_TYPES.SLOOP,
    cargoCapacity: 25,
    speed: 1 / 2000, // 1 tile every 2.5 seconds
    attack: 1000,
    defense: 1000,
    price: 1000,
  },
  [SHIP_TYPES.LONGSHIP]: {
    shipType: SHIP_TYPES.LONGSHIP,
    cargoCapacity: 50,
    speed: 1 / 1500, // 1 tile every 2.5 seconds
    attack: 3000,
    defense: 1500,
    price: 10000,
  },
  [SHIP_TYPES.FRIGATE]: {
    shipType: SHIP_TYPES.FRIGATE,
    cargoCapacity: 100,
    speed: 1 / 2000, // 1 tile every 2.5 seconds
    attack: 2500,
    defense: 2500,
    price: 100000,
  },
}

// TODO: find a better way to keep this in sync with cargo?
export const CARGO_TYPES_LIST = ["WHEAT", "STONE", "WOOD", "WOOL"] as const

export const CARDINAL_DIRECTIONS_ARRAY = [
  [0, 1], // north
  [0, -1], // south
  [1, 0], // east
  [-1, 0], // west
] as const

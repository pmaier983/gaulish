import { type NextRouter } from "next/router"
import { type ShipType } from "schema"

export const AUTH_FREE_PAGES: NextRouter["pathname"][] = ["/"]

export const TILE_PERCENT_SIZE = 0.05

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

export const getTileImageString = (typeId: number) => {
  if (typeId === 1 || typeId === 2 || typeId === 3 || typeId === 4) {
    const TileType = TILE_TYPE_ID_TO_TYPE[typeId]
    return `/${TileType.toLocaleLowerCase()}.webp`
  } else {
    throw new Error("Invalid Tile type_id passed into Tile")
  }
}

export type TILE_TYPE = keyof typeof TILE_TYPES

export const SHIP_ID_TO_SHIP_TYPES: { [key: number]: ShipType } = {
  0: {
    shipTypeId: 0,
    name: "Plank",
    cargo_capacity: 1,
    speed: 1,
  },
  1: {
    shipTypeId: 1,
    name: "Raft",
    cargo_capacity: 10,
    speed: 2,
  },
}

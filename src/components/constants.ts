import { type NextRouter } from "next/router"

export const AUTH_FREE_PAGES: NextRouter["pathname"][] = ["/"]

export const CELL_TYPES = {
  EMPTY: "EMPTY",
  FOREST: "FOREST",
  GRASSLAND: "GRASSLAND",
  MOUNTAIN: "MOUNTAIN",
  OCEAN: "OCEAN",
} as const

export const CELL_TYPE_ID_TO_TYPE = {
  0: CELL_TYPES.EMPTY,
  1: CELL_TYPES.FOREST,
  2: CELL_TYPES.GRASSLAND,
  3: CELL_TYPES.MOUNTAIN,
  4: CELL_TYPES.OCEAN,
}

export const CELL_TYPE_TO_TYPE_ID = {
  [CELL_TYPES.EMPTY]: 0,
  [CELL_TYPES.FOREST]: 1,
  [CELL_TYPES.GRASSLAND]: 2,
  [CELL_TYPES.MOUNTAIN]: 3,
  [CELL_TYPES.OCEAN]: 4,
}

export type CELL_TYPE = keyof typeof CELL_TYPES

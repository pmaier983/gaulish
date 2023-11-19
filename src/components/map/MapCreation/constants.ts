import type { Dispatch, SetStateAction } from "react"

export const DEFAULT_MAP_CREATION_SIZE = 215 // ~50k tiles when square

export const DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE = 10

export const MAP_CREATION_MODES = {
  MAP_CREATION: "MAP_CREATION",
  MAP_TOPPINGS: "MAP_TOPPINGS",
} as const

export type MapCreationMode = keyof typeof MAP_CREATION_MODES

export type SetMapCreationMode = Dispatch<SetStateAction<MapCreationMode>>

import type { Tile } from "schema"
import { TILE_TYPES, type TileType } from "~/components/constants"

const COUNT_OF_TILE_TYPES = Object.keys(TILE_TYPES).length

interface CreateMapOptions {
  width: number
  height: number
  hasRandomTypeId?: boolean
}

export const createMap = ({
  width,
  height,
  hasRandomTypeId,
}: CreateMapOptions): Tile[] => {
  const tiles: Tile[] = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      tiles.push({
        type: hasRandomTypeId
          ? Object.values(TILE_TYPES).at(
              Math.floor(Math.random() * COUNT_OF_TILE_TYPES),
            ) ?? "EMPTY"
          : "EMPTY",
        x: x,
        y: y,
        xyTileId: `${x}:${y}`,
      })
    }
  }
  return tiles
}

interface CreateCreationMapInputs {
  width: number
  height: number
}

export const createCreationMap = ({
  width,
  height,
}: CreateCreationMapInputs): Tile[] => {
  const tiles: Tile[] = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (x % 10 === 0 && y % 10 === 0) {
        tiles.push({
          type: "MOUNTAIN",
          x: x,
          y: y,
          xyTileId: `${x}:${y}`,
        })
      } else {
        tiles.push({
          type: "EMPTY",
          x: x,
          y: y,
          xyTileId: `${x}:${y}`,
        })
      }
    }
  }
  return tiles
}

interface CreateDevMapInputs {
  width: number
  height: number
}

const RANDOM_TILES: TileType[] = ["GRASSLAND", "MOUNTAIN", "FOREST"]

export const createDevMap = ({ width, height }: CreateDevMapInputs) => {
  const tiles: Tile[] = []

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // Check if the x and y coordinates are within the 'X' boundaries
      if ([0, 1, -1].includes(x - y) || (x + y) % width <= 2) {
        tiles.push({
          type: "OCEAN",
          x: x,
          y: y,
          xyTileId: `${x}:${y}`,
        })
      } else {
        tiles.push({
          type:
            RANDOM_TILES[Math.floor(Math.random() * RANDOM_TILES.length)] ??
            "EMPTY",
          x: x,
          y: y,
          xyTileId: `${x}:${y}`,
        })
      }
    }
  }

  return tiles
}

interface GetTileGroupsInputs {
  tiles: Tile[]
  tileGroupSize: number
}

export const getTileGroups = ({
  tiles,
  tileGroupSize,
}: GetTileGroupsInputs): Tile[][] =>
  tiles
    .reduce<Tile[][][]>((acc, cur) => {
      const tileGroupX = Math.floor(cur.x / tileGroupSize)
      const tileGroupY = Math.floor(cur.y / tileGroupSize)

      if (!acc[tileGroupX]) {
        acc[tileGroupX] = []
      }

      if (!acc[tileGroupX]?.[tileGroupY]) {
        acc[tileGroupX]![tileGroupY] = []
      }

      acc[tileGroupX]![tileGroupY]!.push(cur)

      return acc
    }, [])
    .flat()

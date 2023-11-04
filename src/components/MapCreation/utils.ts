import type { Tile } from "schema"
import { TILE_TYPES } from "~/components/constants"

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

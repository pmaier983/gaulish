import type { Tile } from "schema"

interface CreateMapOptions {
  width: number
  height: number
}

export const createMap = ({ width, height }: CreateMapOptions): Tile[] => {
  const tiles: Tile[] = []
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      tiles.push({
        type_id: 0,
        x: x,
        y: y,
        xyTileId: `${x}:${y}`,
      })
    }
  }
  return tiles
}

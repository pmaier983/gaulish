import type { Tile } from "schema"

export const createMap = (width: number, height: number): Tile[] => {
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

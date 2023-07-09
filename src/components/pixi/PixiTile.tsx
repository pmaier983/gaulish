import { Sprite, useApp } from "@pixi/react"
import { type Tile } from "schema"
import { TILE_PERCENT_SIZE, getTileImageString } from "~/components/constants"

export const PixiTile = ({ x, y, type_id, id }: Tile) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const tileXPosition = mapWidth * x * TILE_PERCENT_SIZE
  const tileYPosition = mapWidth * y * TILE_PERCENT_SIZE

  return (
    <Sprite
      key={`${x}:${y}:${id}`}
      x={tileXPosition}
      y={tileYPosition}
      width={mapWidth * TILE_PERCENT_SIZE}
      height={mapWidth * TILE_PERCENT_SIZE}
      image={getTileImageString(type_id)}
    />
  )
}

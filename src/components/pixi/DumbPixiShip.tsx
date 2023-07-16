import { useCallback } from "react"
import type * as PIXI from "pixi.js"
import { Graphics, useApp } from "@pixi/react"
import { type Tile } from "schema"
import { TILE_PERCENT_SIZE } from "~/components/constants"

export const DumbPixiShip = ({ x, y }: Tile) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const shipSquareSize = 0.5
  const fill = "#fff"

  // the width determines the size of the tile
  const tileSize =
    (app.renderer.options.width ?? 0) * TILE_PERCENT_SIZE * shipSquareSize

  const tileXPosition = mapWidth * x * TILE_PERCENT_SIZE
  const tileYPosition = mapWidth * y * TILE_PERCENT_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      g.drawRect(tileXPosition, tileYPosition, tileSize, tileSize)
      g.endFill()
    },
    [tileXPosition, tileYPosition, tileSize],
  )
  return <Graphics draw={draw} />
}

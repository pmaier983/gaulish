import { Graphics, useApp, type _ReactPixi } from "@pixi/react"
import { type Tile } from "schema"
import type * as PIXI from "pixi.js"

import { TILE_PERCENT_SIZE } from "~/components/constants"
import { useCallback } from "react"

type DumbPixiTileProps = Tile & _ReactPixi.IGraphics

/**
 * A Dumb Pixi Tile Component that should lack any gamestate logic
 */
export const DumbPixiTileBorder = ({ x, y, ...rest }: DumbPixiTileProps) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const tileXPosition = mapWidth * x * TILE_PERCENT_SIZE
  const tileYPosition = mapWidth * y * TILE_PERCENT_SIZE

  const tileSize = mapWidth * TILE_PERCENT_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.lineStyle(10, "#000", 1) // Choose the border color
      g.drawRect(tileXPosition, tileYPosition, tileSize, tileSize)
      g.endFill()
    },
    [tileSize, tileXPosition, tileYPosition],
  )

  return (
    <>
      <Graphics draw={draw} {...rest} />
    </>
  )
}

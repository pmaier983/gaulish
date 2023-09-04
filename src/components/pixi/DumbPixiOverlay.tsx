import { Graphics, useApp } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"
import { type Tile } from "schema"

import { TILE_PERCENT_SIZE } from "~/components/constants"

interface DumbPixiOverlayProps {
  tile: Tile
}

export const DumbPixiOverlay = ({ tile, ...rest }: DumbPixiOverlayProps) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const tileSize = mapWidth * TILE_PERCENT_SIZE

  const tileXPosition = tile.x * tileSize
  const tileYPosition = tile.y * tileSize

  const fill = "#000"

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill, 0.6)
      g.drawRect(tileXPosition, tileYPosition, tileSize, tileSize)
      g.endFill()
    },
    [tileSize, tileXPosition, tileYPosition],
  )

  return <Graphics draw={draw} {...rest} />
}

import { Graphics, useApp } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"
import { type Tile } from "schema"

import { TILE_PERCENT_SIZE } from "~/components/constants"

interface DumbPixiOverlayProps {
  tile: Tile
  opacity?: number
}

export const DumbPixiOverlay = ({
  tile,
  opacity = 0.6,
  ...rest
}: DumbPixiOverlayProps) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const tileSize = mapWidth * TILE_PERCENT_SIZE

  const tileXPosition = tile.x * tileSize
  const tileYPosition = tile.y * tileSize

  const fill = "#000"

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill, opacity)
      g.drawRect(tileXPosition, tileYPosition, tileSize, tileSize)
      g.endFill()
    },
    [opacity, tileSize, tileXPosition, tileYPosition],
  )

  return <Graphics draw={draw} {...rest} />
}

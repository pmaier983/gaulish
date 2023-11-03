import { Graphics } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"
import { type Tile } from "schema"

import { TILE_SIZE } from "~/components/constants"

interface DumbPixiOverlayProps {
  tile: Tile
  opacity?: number
}

export const DumbPixiOverlay = ({
  tile,
  opacity = 0.6,
  ...rest
}: DumbPixiOverlayProps) => {
  const fill = "#000"

  const tileXPosition = tile.x * TILE_SIZE
  const tileYPosition = tile.y * TILE_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill, opacity)
      g.drawRect(tileXPosition, tileYPosition, TILE_SIZE, TILE_SIZE)
      g.endFill()
    },
    [opacity, tileXPosition, tileYPosition],
  )

  return <Graphics draw={draw} {...rest} />
}

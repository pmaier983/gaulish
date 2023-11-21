import { Graphics, type _ReactPixi } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"

import { TILE_SIZE } from "~/components/constants"

interface DumbPixiOverlayProps extends _ReactPixi.IGraphics {
  x: number
  y: number
  size?: number
  opacity?: number
}

export const DumbPixiOverlay = ({
  x,
  y,
  size = TILE_SIZE,
  opacity = 0.6,
  ...rest
}: DumbPixiOverlayProps) => {
  const fill = "#000"

  const tileXPosition = x * size
  const tileYPosition = y * size

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill, opacity)
      g.drawRect(tileXPosition, tileYPosition, size, size)
      g.endFill()
    },
    [opacity, size, tileXPosition, tileYPosition],
  )

  return <Graphics draw={draw} {...rest} />
}

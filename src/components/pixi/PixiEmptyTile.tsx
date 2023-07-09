import { Graphics, type _ReactPixi, useApp } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"

interface PixiEmptyTileProps extends _ReactPixi.IGraphics {
  fill: string
  x: number
  y: number
  percentSize: number
}

export const PixiEmptyTile = ({
  fill,
  x,
  y,
  percentSize,
  ...rest
}: PixiEmptyTileProps) => {
  const app = useApp()

  // the width determines the size of the tile
  const tileSize = (app.renderer.options.width ?? 0) * percentSize

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      // Draw a border 1/10th the size of the tile in black
      g.lineStyle(tileSize * (1 / 10), 0x000000)
      g.drawRect(x, y, tileSize, tileSize)
      g.endFill()
    },
    [tileSize, fill, x, y],
  )
  return <Graphics draw={draw} {...rest} />
}

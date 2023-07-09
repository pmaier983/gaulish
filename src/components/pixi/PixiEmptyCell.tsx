import { Graphics, type _ReactPixi, useApp } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"

interface PixiEmptyCellProps extends _ReactPixi.IGraphics {
  fill: string
  x: number
  y: number
  percentSize: number
}

export const PixiEmptyCell = ({
  fill,
  x,
  y,
  percentSize,
  ...rest
}: PixiEmptyCellProps) => {
  const app = useApp()

  const cellSize = (app.renderer.options.width ?? 0) * percentSize

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      g.lineStyle(cellSize * (1 / 10), 0x000000)
      g.drawRect(x, y, cellSize, cellSize)
      g.endFill()
    },
    [cellSize, fill, x, y],
  )
  return <Graphics draw={draw} {...rest} />
}

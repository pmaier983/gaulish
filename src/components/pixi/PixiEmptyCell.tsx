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

  const cellWidth = (app.renderer.options.width ?? 0) * percentSize
  const cellHeight = (app.renderer.options.height ?? 0) * percentSize

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      g.lineStyle(
        (app.renderer.options.width ?? 0) * percentSize * (1 / 10),
        0x000000,
      )
      g.drawRect(x, y, cellWidth, cellHeight)
      g.endFill()
    },
    [
      app.renderer.options.width,
      cellHeight,
      cellWidth,
      fill,
      percentSize,
      x,
      y,
    ],
  )
  return <Graphics draw={draw} {...rest} />
}

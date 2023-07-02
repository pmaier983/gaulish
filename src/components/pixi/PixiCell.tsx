import { Graphics, useApp } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"

interface PixiCellProps {
  fill: string
  x: number
  y: number
  percentSize: number
}

export const PixiCell = ({ fill, x, y, percentSize }: PixiCellProps) => {
  const app = useApp()

  const cellWidth = (app.renderer.options.width ?? 0) * percentSize
  const cellHeight = (app.renderer.options.height ?? 0) * percentSize

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      g.drawRect(x, y, cellWidth, cellHeight)
      g.endFill()
    },
    [cellHeight, cellWidth, fill, x, y],
  )
  return <Graphics draw={draw} />
}

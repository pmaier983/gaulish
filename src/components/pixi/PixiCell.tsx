import { PixiComponent } from "@pixi/react"
import * as PIXI from "pixi.js"

interface PixiCell {
  fill: string
  x: number
  y: number
  width: number
  height: number
}

export const PixiCell = PixiComponent("Viewport", {
  create: () => new PIXI.Graphics(),
  applyProps: (g, _, props: PixiCell) => {
    const { fill, x, y, width, height } = props

    g.clear()
    g.beginFill(fill)
    g.drawRect(x, y, width, height)
    g.endFill()
  },
})

import { Graphics, type _ReactPixi } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"
import { TILE_SIZE } from "~/components/constants"

interface DumbPixiEmptyTileProps extends _ReactPixi.IGraphics {
  fill: string
  x: number
  y: number
  percentSize: number
}

/**
 * A Dumb Pixi Empty Tile Component that should lack any gamestate logic
 */
export const DumbPixiEmptyTile = ({
  fill,
  x,
  y,
  ...rest
}: DumbPixiEmptyTileProps) => {
  const tileXPosition = x * TILE_SIZE
  const tileYPosition = y * TILE_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      // Draw a border 1/10th the size of the tile in black
      g.lineStyle(TILE_SIZE * (1 / 10), 0x000000)
      g.drawRect(tileXPosition, tileYPosition, TILE_SIZE, TILE_SIZE)
      g.endFill()
    },
    [fill, tileXPosition, tileYPosition],
  )
  return <Graphics draw={draw} {...rest} />
}

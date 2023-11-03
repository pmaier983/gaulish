import { Graphics, type _ReactPixi } from "@pixi/react"
import { type Tile } from "schema"
import type * as PIXI from "pixi.js"

import { TILE_SIZE } from "~/components/constants"
import { useCallback } from "react"

type DumbPixiTileProps = Tile & _ReactPixi.IGraphics

/**
 * A Dumb Pixi Tile Component that should lack any gamestate logic
 */
export const DumbPixiTileBorder = ({ x, y, ...rest }: DumbPixiTileProps) => {
  const tileXPosition = x * TILE_SIZE
  const tileYPosition = y * TILE_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.lineStyle(TILE_SIZE * 0.1, "#000", 1) // Choose the border color
      g.drawRect(tileXPosition, tileYPosition, TILE_SIZE, TILE_SIZE)
      g.endFill()
    },
    [tileXPosition, tileYPosition],
  )

  return (
    <>
      <Graphics draw={draw} {...rest} />
    </>
  )
}

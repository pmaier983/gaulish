import { useCallback } from "react"
import type * as PIXI from "pixi.js"
import { Graphics, Text } from "@pixi/react"

import { type Tile } from "schema"
import { FONT_PERCENT_SIZE, TILE_SIZE } from "~/components/constants"

interface DumbPixiShipProps {
  tile: Tile
  name: string
  isEnemy: boolean
}

export const DumbPixiShip = ({ tile, name, isEnemy }: DumbPixiShipProps) => {
  const shipSquareSize = 0.5
  const fill = "#fff"

  // the width determines the size of the tile

  const shipSize = TILE_SIZE * shipSquareSize

  const tileXPosition = tile.x * TILE_SIZE
  const tileYPosition = tile.y * TILE_SIZE

  const shipXPosition = tileXPosition + shipSize / 2
  const shipYPosition = tileYPosition + shipSize / 2

  const fontSize = TILE_SIZE * FONT_PERCENT_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      g.drawRect(shipXPosition, shipYPosition, shipSize, shipSize)
      g.endFill()
    },
    [shipXPosition, shipYPosition, shipSize],
  )

  return (
    <>
      <Graphics draw={draw} />
      <Text
        text={`  ${isEnemy ? "🔴" : "🟢"}${name ?? ""}`}
        x={tileXPosition}
        y={tileYPosition + TILE_SIZE * 0.5 - fontSize / 2}
        width={TILE_SIZE}
        height={fontSize}
      />
    </>
  )
}

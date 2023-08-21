import { useCallback } from "react"
import * as PIXI from "pixi.js"
import { Graphics, Text, useApp } from "@pixi/react"

import { type Tile } from "schema"
import {
  FONT_PERCENT_SIZE,
  type ShipType,
  TILE_PERCENT_SIZE,
} from "~/components/constants"

interface DumbPixiShipProps {
  tile: Tile
  name: string
  shipType: ShipType
  isEnemy: boolean
}

export const DumbPixiShip = ({
  tile,
  shipType,
  isEnemy,
}: DumbPixiShipProps) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const shipSquareSize = 0.5
  const fill = "#fff"

  // the width determines the size of the tile
  const tileSize = mapWidth * TILE_PERCENT_SIZE

  const shipSize = tileSize * shipSquareSize

  const tileXPosition = tile.x * tileSize
  const tileYPosition = tile.y * tileSize

  const shipXPosition = tileXPosition + shipSize / 2
  const shipYPosition = tileYPosition + shipSize / 2

  const fontSize = tileSize * FONT_PERCENT_SIZE

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
        text={`  ${isEnemy ? "🔴" : "🟢"}${shipType.name ?? ""}`}
        x={tileXPosition}
        y={tileYPosition + tileSize * 0.5 - fontSize / 2}
        style={
          new PIXI.TextStyle({
            fontSize: fontSize,
          })
        }
      />
    </>
  )
}

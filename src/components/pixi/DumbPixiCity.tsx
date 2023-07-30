import { Graphics, Text, useApp } from "@pixi/react"
import * as PIXI from "pixi.js"
import { useCallback } from "react"

import { type City, type Tile } from "schema"
import { FONT_PERCENT_SIZE, TILE_PERCENT_SIZE } from "~/components/constants"

interface DumbPixiCityProps {
  city: City
  tile: Tile
}

export const DumbPixiCity = ({ tile, city }: DumbPixiCityProps) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const citySquareSize = 0.5
  const fill = "#d89a6c"

  // the width determines the size of the tile
  const tileSize = mapWidth * TILE_PERCENT_SIZE

  const citySize = tileSize * citySquareSize

  const tileXPosition = tile.x * tileSize
  const tileYPosition = tile.y * tileSize

  const cityXPosition = tileXPosition + citySize / 2
  const cityYPosition = tileYPosition + citySize / 2

  const fontSize = tileSize * FONT_PERCENT_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      g.drawRect(cityXPosition, cityYPosition, citySize, citySize)
      g.endFill()
    },
    [cityXPosition, cityYPosition, citySize],
  )
  return (
    <>
      <Graphics draw={draw} />
      <Text
        text={city.name}
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

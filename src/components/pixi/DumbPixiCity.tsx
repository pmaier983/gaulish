import { Graphics, Text } from "@pixi/react"
import type * as PIXI from "pixi.js"
import { useCallback } from "react"

import { type City, type Tile } from "schema"
import { FONT_PERCENT_SIZE, TILE_SIZE } from "~/components/constants"

interface DumbPixiCityProps {
  city: City
  tile: Tile
}

export const DumbPixiCity = ({ tile, city }: DumbPixiCityProps) => {
  const citySquareSize = 0.5
  const fill = "#d89a6c"

  // the width determines the size of the tile

  const citySize = TILE_SIZE * citySquareSize

  const tileXPosition = tile.x * TILE_SIZE
  const tileYPosition = tile.y * TILE_SIZE

  const cityXPosition = tileXPosition + citySize / 2
  const cityYPosition = tileYPosition + citySize / 2

  const fontSize = TILE_SIZE * FONT_PERCENT_SIZE

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
        y={tileYPosition + TILE_SIZE * 0.5 - fontSize / 2}
        width={TILE_SIZE}
        height={fontSize}
      />
    </>
  )
}

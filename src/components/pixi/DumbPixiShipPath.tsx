import { useCallback } from "react"
import { Graphics, useApp } from "@pixi/react"
import type * as PIXI from "pixi.js"

import { type Tile } from "schema"
import { DIRECTIONS, TILE_PERCENT_SIZE } from "~/components/constants"
import { type SelectedShipPath } from "~/state/gamestateStore"

interface DumbPixiShipPathProps {
  tile: Tile
  selectedShipPath: SelectedShipPath
}

export const DumbPixiShipPath = ({
  tile,
  selectedShipPath,
}: DumbPixiShipPathProps) => {
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const fill = "#FF0000"

  // the width determines the size of the tile
  const tileSize = mapWidth * TILE_PERCENT_SIZE

  const pathBarWidth = tileSize / 5

  const tileXPosition = tile.x * tileSize
  const tileYPosition = tile.y * tileSize

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      g.drawRect(
        tileXPosition + tileSize / 4,
        tileYPosition + tileSize / 4,
        tileSize / 2,
        tileSize / 2,
      )
      switch (selectedShipPath?.directionTowardsPrevTile) {
        case DIRECTIONS.NORTH: {
          g.drawRect(
            tileXPosition + tileSize / 2 - pathBarWidth / 2,
            tileYPosition,
            pathBarWidth,
            tileSize / 2,
          )
          g.endFill()
        }
        case DIRECTIONS.SOUTH: {
          g.drawRect(
            tileXPosition + tileSize / 2 - pathBarWidth / 2,
            tileYPosition + tileSize / 2,
            pathBarWidth,
            tileSize / 2,
          )
          g.endFill()
        }
        case DIRECTIONS.EAST: {
          g.drawRect(
            tileXPosition,
            tileYPosition + tileSize / 2 - pathBarWidth / 2,
            tileSize / 2,
            pathBarWidth,
          )
          g.endFill()
        }
        case DIRECTIONS.WEST: {
          g.drawRect(
            tileXPosition + tileSize / 2,
            tileYPosition + tileSize / 2 - pathBarWidth / 2,
            tileSize / 2,
            pathBarWidth,
          )
          g.endFill()
        }
        default: {
          g.endFill()
        }
      }
    },
    [
      selectedShipPath?.directionTowardsPrevTile,
      tileXPosition,
      tileSize,
      pathBarWidth,
      tileYPosition,
    ],
  )
  return <Graphics draw={draw} />
}

import { useCallback } from "react"
import { Graphics } from "@pixi/react"
import type * as PIXI from "pixi.js"

import { type Tile } from "schema"
import { DIRECTIONS, TILE_SIZE } from "~/components/constants"
import { type SelectedShipPath } from "~/state/gamestateStore"

interface DumbPixiShipPathProps {
  tile: Tile
  selectedShipPath: SelectedShipPath
}

export const DumbPixiShipPath = ({
  tile,
  selectedShipPath,
}: DumbPixiShipPathProps) => {
  const fill = "#FF0000"

  const pathBarWidth = TILE_SIZE / 5

  const tileXPosition = tile.x * TILE_SIZE
  const tileYPosition = tile.y * TILE_SIZE

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)
      if (selectedShipPath.isLastTileInPath) {
        g.drawRect(
          tileXPosition + TILE_SIZE / 4,
          tileYPosition + TILE_SIZE / 4,
          TILE_SIZE / 2,
          TILE_SIZE / 2,
        )
      }
      // If the last tile in the path, draw the "ship"
      if (selectedShipPath.directionLinesToDraw.length === 0) {
        g.endFill()
      }

      selectedShipPath.directionLinesToDraw.forEach((direction) => {
        switch (direction) {
          case DIRECTIONS.NORTH: {
            g.drawRect(
              tileXPosition + TILE_SIZE / 2 - pathBarWidth / 2,
              tileYPosition,
              pathBarWidth,
              TILE_SIZE / 2,
            )
            break
          }
          case DIRECTIONS.SOUTH: {
            g.drawRect(
              tileXPosition + TILE_SIZE / 2 - pathBarWidth / 2,
              tileYPosition + TILE_SIZE / 2,
              pathBarWidth,
              TILE_SIZE / 2,
            )
            break
          }
          case DIRECTIONS.EAST: {
            g.drawRect(
              tileXPosition + TILE_SIZE / 2,
              tileYPosition + TILE_SIZE / 2 - pathBarWidth / 2,
              TILE_SIZE / 2,
              pathBarWidth,
            )
            break
          }
          case DIRECTIONS.WEST: {
            g.drawRect(
              tileXPosition,
              tileYPosition + TILE_SIZE / 2 - pathBarWidth / 2,
              TILE_SIZE / 2,
              pathBarWidth,
            )
            break
          }
        }
      })

      g.endFill()
    },
    [
      pathBarWidth,
      selectedShipPath.directionLinesToDraw,
      selectedShipPath.isLastTileInPath,
      tileXPosition,
      tileYPosition,
    ],
  )
  return <Graphics draw={draw} />
}

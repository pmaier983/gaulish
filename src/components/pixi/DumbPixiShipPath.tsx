import { useCallback } from "react"
import { Graphics } from "@pixi/react"
import type * as PIXI from "pixi.js"

import { type Tile } from "schema"
import { DIRECTIONS, TILE_SIZE } from "~/components/constants"
import { generateSelectedShipPathObject } from "~/utils"

interface DumbPixiShipPathProps {
  tile: Tile
  shipPath: string[]
}

export const DumbPixiShipPath = ({ tile, shipPath }: DumbPixiShipPathProps) => {
  const fill = "#FF0000"

  const pathBarWidth = TILE_SIZE / 5

  const tileXPosition = tile.x * TILE_SIZE
  const tileYPosition = tile.y * TILE_SIZE

  const selectedShipPath = generateSelectedShipPathObject(shipPath)

  const selectedShipPathTile = selectedShipPath[tile.xyTileId]

  if (!selectedShipPathTile) {
    throw new Error("This tile has no path information to render")
  }

  const lastTileId = shipPath.at(-1)

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()
      g.beginFill(fill)

      // If is last tile in path
      if (lastTileId === tile.xyTileId) {
        g.drawRect(
          tileXPosition + TILE_SIZE / 4,
          tileYPosition + TILE_SIZE / 4,
          TILE_SIZE / 2,
          TILE_SIZE / 2,
        )
      }

      selectedShipPathTile.directionLinesToDraw.forEach((direction) => {
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
      lastTileId,
      pathBarWidth,
      selectedShipPathTile.directionLinesToDraw,
      tile.xyTileId,
      tileXPosition,
      tileYPosition,
    ],
  )

  return <Graphics draw={draw} />
}

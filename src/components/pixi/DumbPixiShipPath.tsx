import { useCallback } from "react"
import { Graphics } from "@pixi/react"
import type * as PIXI from "pixi.js"

import { DIRECTIONS, TILE_SIZE } from "~/components/constants"
import { generateSelectedShipPathObject, getXYFromXYTileId } from "~/utils"

interface DumbPixiShipPathProps {
  shipPath: string[]
}

export const DumbPixiShipPath = ({ shipPath }: DumbPixiShipPathProps) => {
  const fill = "#FF0000"

  const pathBarWidth = TILE_SIZE / 5

  const selectedShipPath = generateSelectedShipPathObject(shipPath)

  const draw = useCallback(
    (g: PIXI.Graphics) => {
      // Remove any previously drawn path
      g.clear()

      g.beginFill(fill)

      shipPath.forEach((xyTileId, i) => {
        const { x, y } = getXYFromXYTileId(xyTileId)

        const tileXPosition = x * TILE_SIZE
        const tileYPosition = y * TILE_SIZE

        const selectedShipPathTile = selectedShipPath[xyTileId]

        if (!selectedShipPathTile) {
          console.error(
            "selectedShipPath did not include a tile present in shipPath",
          )
          return
        }

        const isLastTile = i === shipPath.length - 1

        if (isLastTile) {
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
      })

      g.endFill()
    },
    [pathBarWidth, selectedShipPath, shipPath],
  )

  return <Graphics draw={draw} />
}

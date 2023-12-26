import { useCallback, useState } from "react"
import type * as PIXI from "pixi.js"
import { Graphics, Text } from "@pixi/react"

import { FONT_PERCENT_SIZE, TILE_SIZE } from "~/components/constants"
import type { StoredNpc } from "~/state/mapCreationStore"
import { getXYFromXYTileId } from "~/utils"
import { DumbPixiShipPath } from "~/components/pixi/DumbPixiShipPath"

interface DumbPixiNpcPathProps {
  npc: StoredNpc
}

export const DumbPixiNpcPath = ({ npc }: DumbPixiNpcPathProps) => {
  const [isNpcPathVisible, setIsNpcPathVisible] = useState(false)
  const shipSquareSize = 0.5
  const fill = "#fff"

  // the width determines the size of the tile

  const shipSize = TILE_SIZE * shipSquareSize

  const firstTileXYTileId = npc.pathArray.at(0)

  if (!firstTileXYTileId)
    throw Error("The npc passed into DumbPixiNpcPath had no first tile")

  const { x, y } = getXYFromXYTileId(firstTileXYTileId)

  const tileXPosition = x * TILE_SIZE
  const tileYPosition = y * TILE_SIZE

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
      {isNpcPathVisible && <DumbPixiShipPath shipPath={npc.pathArray} />}
      <Graphics
        draw={draw}
        mousedown={() => {
          setIsNpcPathVisible(!isNpcPathVisible)
        }}
        interactive
      />
      <Text
        text={`${npc.shipType}:${npc.id}`}
        x={tileXPosition}
        y={tileYPosition + TILE_SIZE * 0.5 - fontSize / 2}
        width={TILE_SIZE}
        height={fontSize}
        mousedown={() => {
          setIsNpcPathVisible(!isNpcPathVisible)
        }}
        interactive
      />
    </>
  )
}

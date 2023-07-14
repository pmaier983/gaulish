import { Sprite, Text, useApp } from "@pixi/react"
import { type Tile } from "schema"
import * as PIXI from "pixi.js"

import { TILE_PERCENT_SIZE, getTileImageString } from "~/components/constants"
import { useGlobalStore } from "~/state/globalStore"
import { useCallback } from "react"

export const PixiTile = ({ x, y, type_id }: Tile) => {
  const { isUserAdmin } = useGlobalStore(
    useCallback(
      (state) => ({
        isUserAdmin: state.isUserAdmin,
      }),
      [],
    ),
  )
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const tileXPosition = mapWidth * x * TILE_PERCENT_SIZE
  const tileYPosition = mapWidth * y * TILE_PERCENT_SIZE

  const textSize = (mapWidth * TILE_PERCENT_SIZE) / 5

  return (
    <>
      <Sprite
        x={tileXPosition}
        y={tileYPosition}
        width={mapWidth * TILE_PERCENT_SIZE}
        height={mapWidth * TILE_PERCENT_SIZE}
        image={getTileImageString(type_id)}
      />
      {isUserAdmin && (
        <Text
          text={`${x}:${y}`}
          x={tileXPosition + textSize / 2}
          y={tileYPosition + textSize / 2}
          width={textSize}
          height={textSize}
          style={
            new PIXI.TextStyle({
              fill: "#ffffff",
            })
          }
        />
      )}
    </>
  )
}

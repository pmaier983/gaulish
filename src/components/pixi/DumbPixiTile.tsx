import { Sprite, Text, type _ReactPixi } from "@pixi/react"
import { type Tile } from "schema"
import * as PIXI from "pixi.js"

import { FONT_PERCENT_SIZE, TILE_SIZE } from "~/components/constants"
import { useGlobalStore } from "~/state/globalStore"
import { getTileImageString } from "~/utils"
import { useState } from "react"

type DumbPixiTileProps = Tile & _ReactPixi.ISprite

/**
 * A Dumb Pixi Tile Component that should lack any gamestate logic
 */
export const DumbPixiTile = ({ x, y, type, ...rest }: DumbPixiTileProps) => {
  const [hasCoordinatesVisible, setCoordinatesVisibility] = useState(false)
  const { isUserAdmin } = useGlobalStore((state) => ({
    isUserAdmin: state.isUserAdmin,
  }))

  const texture = PIXI.Texture.from(getTileImageString(type))

  const tileXPosition = x * TILE_SIZE
  const tileYPosition = y * TILE_SIZE

  return (
    <>
      <Sprite
        x={tileXPosition}
        y={tileYPosition}
        width={TILE_SIZE}
        height={TILE_SIZE}
        texture={texture}
        mouseover={() => {
          setCoordinatesVisibility(true)
        }}
        mouseout={() => {
          setCoordinatesVisibility(false)
        }}
        {...rest}
      />
      {hasCoordinatesVisible && isUserAdmin && (
        <Text
          text={`${x}:${y}`}
          x={tileXPosition}
          y={tileYPosition}
          width={TILE_SIZE * FONT_PERCENT_SIZE}
          height={TILE_SIZE * FONT_PERCENT_SIZE}
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

import { Sprite, Text, useApp } from "@pixi/react"
import { useAtom } from "jotai"
import { type Tile } from "schema"
import { TILE_PERCENT_SIZE, getTileImageString } from "~/components/constants"
import { isUserAdminAtom } from "~/utils/atoms"

export const PixiTile = ({ x, y, type_id }: Tile) => {
  const [isUserAdmin] = useAtom(isUserAdminAtom)
  const app = useApp()

  const mapWidth = app.renderer.options.width ?? 0

  const tileXPosition = mapWidth * x * TILE_PERCENT_SIZE
  const tileYPosition = mapWidth * y * TILE_PERCENT_SIZE

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
          x={tileXPosition}
          y={tileYPosition}
          anchor={0.5}
        />
      )}
    </>
  )
}

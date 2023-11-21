import { Sprite, type _ReactPixi } from "@pixi/react"
import { useAtom } from "jotai"

import {
  TILE_SIZE,
  TILE_TYPES_TO_LOWERCASE,
  type TileType,
} from "~/components/constants"
import { spritesheetAtom } from "~/state/atoms"

interface DumbPixiTileProps extends _ReactPixi.ISprite {
  type: TileType
  size?: number
  x: number
  y: number
}

/**
 * A Dumb Pixi Tile Component that should lack any gamestate logic
 */
export const DumbPixiTile = ({
  x,
  y,
  type,
  size = TILE_SIZE,
  ...rest
}: DumbPixiTileProps) => {
  const [spritesheet] = useAtom(spritesheetAtom)

  const texture = spritesheet.textures[`${TILE_TYPES_TO_LOWERCASE[type]}.webp`]

  const tileXPosition = x * size
  const tileYPosition = y * size

  return (
    <Sprite
      x={tileXPosition}
      y={tileYPosition}
      width={size}
      height={size}
      texture={texture}
      {...rest}
    />
  )
}

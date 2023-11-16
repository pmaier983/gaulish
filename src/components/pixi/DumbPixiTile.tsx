import { Sprite, type _ReactPixi } from "@pixi/react"
import { type Tile } from "schema"

import { TILE_SIZE, TILE_TYPES_TO_LOWERCASE } from "~/components/constants"
import { useAtom } from "jotai"
import { spritesheetAtom } from "~/state/atoms"

type DumbPixiTileProps = Tile & _ReactPixi.ISprite

/**
 * A Dumb Pixi Tile Component that should lack any gamestate logic
 */
export const DumbPixiTile = ({ x, y, type, ...rest }: DumbPixiTileProps) => {
  const [spritesheet] = useAtom(spritesheetAtom)

  const texture = spritesheet.textures[`${TILE_TYPES_TO_LOWERCASE[type]}.webp`]

  const tileXPosition = x * TILE_SIZE
  const tileYPosition = y * TILE_SIZE

  return (
    <Sprite
      x={tileXPosition}
      y={tileYPosition}
      width={TILE_SIZE}
      height={TILE_SIZE}
      texture={texture}
      {...rest}
    />
  )
}

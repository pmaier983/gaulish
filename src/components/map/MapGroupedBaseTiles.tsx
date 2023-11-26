import { Container } from "@pixi/react"
import { Fragment, memo } from "react"

import type { Tile } from "schema"
import { TILE_GROUP_SIZE } from "~/components/constants"
import { getTileGroups } from "~/components/map/MapCreation/utils"
import { DumbPixiTileText } from "~/components/pixi/DumbPixiTileText"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { useGlobalStore } from "~/state/globalStore"

interface MapGroupedPixiTileBaseProps {
  mapArray: Tile[]
}

let count = 0

/**
 * This component subdivides our large map array into smaller groups of tiles.
 *
 * The size of the groups is controlled by TILE_GROUP_SIZE
 *
 * Subdividing the map into smaller groups allows us to use cacheAsBitmap on the groups
 * Which I "think" transforms them from X number of tiles/sprites into a single tile/sprite?
 */
// TODO: why is the interactive (onclick) of DumbPixiTile not working for the whole map here?
export const MapGroupedPixiTileBase = memo(
  ({ mapArray }: MapGroupedPixiTileBaseProps) => {
    const { isUserAdmin } = useGlobalStore((state) => ({
      isUserAdmin: state.isUserAdmin,
    }))

    // The tiles are grouped into square groups
    const groupedTiles = getTileGroups({
      tiles: mapArray,
      tileGroupSize: TILE_GROUP_SIZE,
    })

    return (
      <>
        {/* We group tiles to allow for good cullAreas and acceptable cacheAsBitmap as well */}
        {groupedTiles.map((tileGroup) => {
          const firstTileOfGroup = tileGroup.at(0)

          if (!firstTileOfGroup)
            throw Error("Found a tile group without any content")

          const groupX = Math.floor(firstTileOfGroup.x / TILE_GROUP_SIZE)

          const groupY = Math.floor(firstTileOfGroup.y / TILE_GROUP_SIZE)

          return (
            <Container
              key={`baseTileContainer-${groupX}:${groupY}`}
              cacheAsBitmap
            >
              {tileGroup.map((tile, tileIndex) => {
                count++
                if (count % 5000 === 0) {
                  console.log("Render Base Group Tile", count)
                }

                // Only show tile text every 10th tile and if user is admin
                const hasText = isUserAdmin && tileIndex % 10 === 0

                return (
                  <Fragment key={`baseTile-${tile.xyTileId}`}>
                    <DumbPixiTile {...tile} />
                    {hasText && (
                      <DumbPixiTileText text={tile.xyTileId} {...tile} />
                    )}
                  </Fragment>
                )
              })}
            </Container>
          )
        })}
      </>
    )
  },
)

MapGroupedPixiTileBase.displayName = "MapGroupedPixiTileBase"

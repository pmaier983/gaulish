import { Container } from "@pixi/react"
import * as PIXI from "pixi.js"
import { memo } from "react"

import type { Tile } from "schema"
import { TILE_GROUP_SIZE, TILE_SIZE } from "~/components/constants"
import { getTileGroups } from "~/components/map/MapCreation/utils"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"

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
              cacheAsBitmap={true}
              cullArea={
                new PIXI.Rectangle(
                  groupX * TILE_SIZE, // x
                  groupY * TILE_SIZE, // y
                  TILE_SIZE, // width
                  TILE_SIZE, // height
                )
              }
            >
              {tileGroup.map((tile) => {
                count++
                if (count % 100 === 0) {
                  console.log("Render Base Group Tile", count)
                }

                return (
                  <DumbPixiTile key={`baseTile-${tile.xyTileId}`} {...tile} />
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

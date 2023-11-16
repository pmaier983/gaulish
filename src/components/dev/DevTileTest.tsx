import * as PIXI from "pixi.js"
import dynamic from "next/dynamic"
import { useAtom } from "jotai"
import { Container } from "@pixi/react"

import { useElementSize } from "~/hooks/useElementSize"
import { createDevMap, getTileGroups } from "~/components/map/MapCreation/utils"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { TILE_GROUP_SIZE, TILE_SIZE } from "~/components/constants"
import { spritesheetStateAtom } from "~/state/atoms"

const MapWrapper = dynamic(
  () =>
    import("~/components/map/MapWrapper").then(
      (allExports) => allExports.MapWrapper_DO_NOT_USE_DIRECTLY,
    ),
  {
    ssr: false,
  },
)

const MAP_WIDTH = 125
const MAP_HEIGHT = 125

// This file is to figure out how Texture & Sprite-sheets work in Pixi.js
const DevTileTest = () => {
  const { sizeRef, size } = useElementSize()

  const tileMap = createDevMap({
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  })

  const [{ isSpritesheetLoaded }] = useAtom(spritesheetStateAtom)

  // TODO make a better loading spinner
  if (!isSpritesheetLoaded) return "Loading..."

  // The tiles are grouped into square groups
  const groupedTiles = getTileGroups({
    tiles: tileMap,
    tileGroupSize: TILE_GROUP_SIZE,
  })

  return (
    <div className="flex w-[50%] flex-1 self-center p-10">
      <div className="flex flex-1" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          {/* We group tiles to allow for good cullAreas and acceptable cacheAsBitmap as well */}
          {groupedTiles.map((tileGroup) => {
            const firstTileOfGroup = tileGroup.at(0)

            if (!firstTileOfGroup)
              throw Error("Found a tile group without any content")

            const groupX = Math.floor(firstTileOfGroup.x / TILE_GROUP_SIZE)

            const groupY = Math.floor(firstTileOfGroup.y / TILE_GROUP_SIZE)

            return (
              <Container
                key={`${groupX}:${groupY}`}
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
                {tileGroup.map((tile) => (
                  <DumbPixiTile {...tile} key={tile.xyTileId} />
                ))}
              </Container>
            )
          })}
        </MapWrapper>
      </div>
    </div>
  )
}

// eslint-disable-next-line import/no-default-export
export default DevTileTest

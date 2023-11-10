import { useState } from "react"
import * as PIXI from "pixi.js"

import MapWrapper from "~/components/MapWrapper"
import { useElementSize } from "~/hooks/useElementSize"
import { createDevMap } from "~/components/MapCreation/utils"
import { getTileImageString } from "~/utils"
import { Container, Sprite } from "@pixi/react"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { TILE_SIZE } from "~/components/constants"

const MAP_WIDTH = 200
const MAP_HEIGHT = 200

// TODO: Use Pixi.assets (https://pixijs.download/dev/docs/PIXI.Assets.html) to load the images
// TODO: Setup SpriteSheets (https://pixijs.download/dev/docs/PIXI.Spritesheet.html)
// TODO: find a way to show a loading spinner or something
// TODO: separate the map into chunks (and set the chunks to cull-able)
// TODO: set Cull Area to a rectangle

/**
 * How to Render The Map
 *
 * 1. Layer 1 (The Stable Tiles)
 * - Render all the tiles in blocks of (X) - I'm guessing 4-16 tiles?
 * - Render with an opacity of 0 if the tile is not in the visible set
 *
 * 2. Layer 2 (Everything Else)
 * - Not sure how much this matters
 */

// This file is to figure out how Texture & Sprite-sheets work in Pixi.js
export const DevTileTest = () => {
  const [cacheAsBitmap, setCacheAsBitmap] = useState(false)
  const { sizeRef, size } = useElementSize()

  const tileMap = createDevMap({
    width: MAP_WIDTH,
    height: MAP_HEIGHT,
  })

  console.log("tile count:", tileMap.length)

  return (
    <div className="flex w-[50%] flex-1 self-center p-10">
      <div className="flex flex-1" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          <Container position={[0, 0]} cacheAsBitmap={cacheAsBitmap}>
            {tileMap.map((tile) => (
              <DumbPixiTile {...tile} key={tile.xyTileId} />
            ))}
          </Container>
        </MapWrapper>
      </div>
      <button
        onClick={() => {
          setCacheAsBitmap((prev) => !prev)
        }}
      >
        Hit me {cacheAsBitmap ? "true" : "false"}
      </button>
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const InsideMap = () => {
  const renderTexture = PIXI.RenderTexture.create({ width: 800, height: 600 })

  const texture = PIXI.Texture.from(getTileImageString("GRASSLAND"))

  return (
    <>
      <Sprite
        texture={renderTexture}
        x={0}
        y={0}
        width={TILE_SIZE}
        height={TILE_SIZE}
      />
      <Sprite
        texture={texture}
        x={0}
        y={0}
        width={TILE_SIZE}
        height={TILE_SIZE}
      />
    </>
  )
}

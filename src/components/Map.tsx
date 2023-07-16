import React from "react"
import { PixiStage } from "~/components/pixi/PixiStage"
import { PixiViewport } from "~/components/pixi/PixiViewport"

import type { Tile } from "schema"
import { MapPixiTile } from "~/components/MapPixiTile"

interface MapProps {
  mapWidth: number
  mapHeight: number
  mapArray?: Tile[]
}

let count = 0

/**
  Generic Map Component. Mainly to render the main game map

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const Map = ({ mapWidth, mapHeight, mapArray }: MapProps) => {
  console.log("Map Render Count:", count++)
  return (
    <PixiStage
      width={mapWidth}
      height={mapHeight}
      options={{ backgroundColor: 0xaaaaaa }}
    >
      <PixiViewport width={mapWidth} height={mapHeight}>
        {mapArray?.map((tile) => {
          const tileId = `${tile.x}:${tile.y}`
          return <MapPixiTile key={tileId} {...tile} />
        })}
      </PixiViewport>
    </PixiStage>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default React.memo(Map)

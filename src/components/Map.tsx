import { PixiStage } from "~/components/pixi/PixiStage"
import { PixiViewport } from "~/components/pixi/PixiViewport"

import type { Tile } from "schema"
import { PixiTile } from "~/components/pixi/PixiTile"
import { api } from "~/utils/api"

interface MapProps {
  mapWidth: number
  mapHeight: number
  map?: Tile[]
}

/**
  Generic Map Component. Mainly to render the main game map

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const Map = ({ mapWidth, mapHeight, map }: MapProps) => {
  return (
    <PixiStage
      width={mapWidth}
      height={mapHeight}
      options={{ backgroundColor: 0xaaaaaa }}
    >
      <PixiViewport width={mapWidth} height={mapHeight}>
        {map?.map((tile) => (
          <PixiTile key={`${tile.x}:${tile.y}`} {...tile} />
        ))}
      </PixiViewport>
    </PixiStage>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default Map

import React from "react"
import { PixiStage } from "~/components/pixi/PixiStage"
import { PixiViewport } from "~/components/pixi/PixiViewport"

import type { Tile } from "schema"

interface MapWrapperProps {
  mapWidth: number
  mapHeight: number
  mapArray?: Tile[]
  className?: string
  children: React.ReactNode
}

let count = 0

/**
  Generic Map Component. Mainly to render the main game map

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapWrapper = ({
  mapWidth,
  mapHeight,
  children,
  className,
}: MapWrapperProps) => {
  console.log("Map Render Count:", count++)
  return (
    <PixiStage
      width={mapWidth}
      height={mapHeight}
      options={{ backgroundColor: 0x006994 }}
      className={className}
    >
      <PixiViewport width={mapWidth} height={mapHeight}>
        {children}
      </PixiViewport>
    </PixiStage>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default React.memo(MapWrapper)

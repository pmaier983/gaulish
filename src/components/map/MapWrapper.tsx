import React, { memo } from "react"
import { useAtom } from "jotai"

import { PixiStage } from "~/components/pixi/PixiStage"
import { PixiViewport } from "~/components/pixi/PixiViewport"
import { spritesheetStateAtom } from "~/state/atoms"

interface MapWrapperProps {
  mapWidth: number
  mapHeight: number
  className?: string
  children: React.ReactNode
}

let count = 0

/**
  MapWrapper Component. Generic Wrapper around the map tiles

  @example import method
  const MapWrapper = dynamic(
    () =>
      import("~/components/map/MapWrapper").then(
        (allExports) => allExports.MapWrapper_DO_NOT_USE_DIRECTLY,
      ),
    {
      ssr: false,
    },
  )
*/
export const MapWrapper_DO_NOT_USE_DIRECTLY = memo(
  ({ mapWidth, mapHeight, children, className }: MapWrapperProps) => {
    console.log("Map Render Count:", count++)

    const [{ isSpritesheetLoaded }] = useAtom(spritesheetStateAtom)

    if (!isSpritesheetLoaded) {
      throw Error(
        "Stage Loaded before Spritesheet. This can cause issues when cacheAsBitmap is set to true",
      )
    }

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
  },
)

MapWrapper_DO_NOT_USE_DIRECTLY.displayName = "MapWrapper"

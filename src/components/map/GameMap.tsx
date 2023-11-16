import dynamic from "next/dynamic"
import { useAtom } from "jotai"

import { useGamestateStore } from "~/state/gamestateStore"
import { useElementSize } from "~/hooks/useElementSize"
import { useGlobalStore } from "~/state/globalStore"
import { MapFooter } from "~/components/map/MapFooter"
import { DevNavBar } from "~/components/dev/DevNavBar"
import { ProfilePicture } from "~/components/ProfilePicture"
import { spritesheetStateAtom } from "~/state/atoms"
import { MapGroupedPixiTileBase } from "~/components/map/MapGroupedBaseTiles"
import { MapPixiOverTiles } from "~/components/map/MapPixiOverTiles"

const MapWrapper = dynamic(
  () =>
    import("~/components/map/MapWrapper").then(
      (allExports) => allExports.MapWrapper_DO_NOT_USE_DIRECTLY,
    ),
  {
    ssr: false,
  },
)

interface MapProps {
  className?: string
}

/**
  GameMap Component. To Render the main Map in the app

  @example import method
  const GameMap = dynamic(
    () =>
      import("~/components/map/GameMap").then(
        (allExports) => allExports.GameMap_DO_NOT_USE_DIRECTLY,
      ),
    {
      ssr: false,
    },
  )
*/
export const GameMap_DO_NOT_USE_DIRECTLY = ({ className }: MapProps) => {
  const { isMapDisabled } = useGlobalStore((state) => ({
    isMapDisabled: state.isMapDisabled,
  }))
  const { selectedShip, mapArray, visibleTilesObject, knownTilesObject } =
    useGamestateStore((state) => ({
      mapArray: state.mapArray,
      selectedShip: state.selectedShip,
      visibleTilesObject: state.visibleTilesObject,
      knownTilesObject: state.knownTilesObject,
    }))
  const { sizeRef, size } = useElementSize()

  const [{ isSpritesheetLoaded }] = useAtom(spritesheetStateAtom)

  if (!isSpritesheetLoaded)
    // TODO: make a better loading component
    return (
      <div className={className} ref={sizeRef}>
        Loading...
      </div>
    )

  return (
    <div className={className} ref={sizeRef}>
      {isMapDisabled && (
        <div className="absolute h-full w-full bg-black opacity-50" />
      )}
      <MapFooter />
      <DevNavBar />
      <ProfilePicture className="absolute right-0 h-20 w-20 pr-4 pt-4" />
      <MapWrapper
        mapWidth={size.width}
        mapHeight={size.height}
        className={selectedShip ? "border-8 border-red-500" : ""}
      >
        <>
          <MapGroupedPixiTileBase
            mapArray={mapArray}
            knownTilesObject={knownTilesObject}
            visibleTilesObject={visibleTilesObject}
          />
          <MapPixiOverTiles />
        </>
      </MapWrapper>
    </div>
  )
}

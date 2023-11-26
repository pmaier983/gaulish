import dynamic from "next/dynamic"
import type { Tile } from "schema"
import type { SetMapCreationMode } from "~/components/map/MapCreation/constants"
import { MapGroupedPixiTileBase } from "~/components/map/MapGroupedBaseTiles"
import { useElementSize } from "~/hooks/useElementSize"

const MapWrapper = dynamic(
  () =>
    import("~/components/map/MapWrapper").then(
      (allExports) => allExports.MapWrapper_DO_NOT_USE_DIRECTLY,
    ),
  {
    ssr: false,
  },
)

interface MapToppingsProps {
  className?: string
  mapArray: Tile[]
  mapObject: { [xyTileId: string]: Tile }
  setMapCreationMode: SetMapCreationMode
  setMapArray: (newMapArray: Tile[]) => void
  mapSize: number
  setMapSize: (newSize: number) => void
}

export const MapToppings = ({ className, mapArray }: MapToppingsProps) => {
  const { size, sizeRef } = useElementSize()
  return (
    <div className={`${className} flex flex-1 flex-row gap-8 p-8`}>
      <div className="flex flex-1" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          <MapGroupedPixiTileBase mapArray={mapArray} />
        </MapWrapper>
      </div>
      <div className="flex-1">Hello</div>
    </div>
  )
}

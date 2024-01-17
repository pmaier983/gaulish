import { useAtom } from "jotai"
import React from "react"

import type { Tile } from "schema"
import { MapCreation } from "~/components/map/MapCreation/MapCreation"
import { MapToppings } from "~/components/map/MapCreation/MapToppings"
import { MAP_CREATION_MODES } from "~/components/map/MapCreation/constants"
import { spritesheetStateAtom } from "~/state/atoms"
import { useMapCreationStore } from "~/state/mapCreationStore"

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreationWrapper = () => {
  const mapCreationState = useMapCreationStore((state) => state)

  const { mapCreationMode, mapArray, setMapArray, setMapCreationMode } =
    mapCreationState

  const mapObject = mapArray.reduce<{ [xyTileId: string]: Tile }>(
    (acc, tile) => {
      acc[tile.xyTileId] = tile
      return acc
    },
    {},
  )

  const renderMapCreationToolbar = () => {
    return (
      <>
        <div className="flex gap-2 self-center pt-10">
          <button
            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
            onClick={() => {
              setMapArray([])
              setMapCreationMode(MAP_CREATION_MODES.MAP_CREATION)
            }}
          >
            Clear Map
          </button>
          <button
            onClick={() => {
              console.log(mapCreationState)
            }}
            className="rounded bg-orange-500 p-2 text-white hover:bg-orange-700"
          >
            Console Map Creation State
          </button>
        </div>
      </>
    )
  }

  const [{ isSpritesheetLoaded }] = useAtom(spritesheetStateAtom)

  if (!isSpritesheetLoaded) {
    return "Loading Spritesheet..."
  }

  switch (mapCreationMode) {
    case MAP_CREATION_MODES.MAP_CREATION: {
      return (
        <>
          {renderMapCreationToolbar()}
          <MapCreation mapObject={mapObject} />
        </>
      )
    }
    case MAP_CREATION_MODES.MAP_TOPPINGS: {
      return (
        <>
          {renderMapCreationToolbar()}
          <MapToppings mapObject={mapObject} />
        </>
      )
    }
  }
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreationWrapper

import { useAtom } from "jotai"
import React, { useState } from "react"

import type { Tile } from "schema"
import { MapCreation } from "~/components/map/MapCreation/MapCreation"
import { MapToppings } from "~/components/map/MapCreation/MapToppings"
import {
  MAP_CREATION_MODES,
  DEFAULT_MAP_CREATION_SIZE,
  type MapCreationMode,
} from "~/components/map/MapCreation/constants"
import { createCreationMap } from "~/components/map/MapCreation/utils"
import { useLocalStorage } from "~/hooks/useLocalStorage"
import { spritesheetStateAtom } from "~/state/atoms"

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreationWrapper = () => {
  const [mapSize, setLocalMapSize] = useState(DEFAULT_MAP_CREATION_SIZE)
  const [storedMapArray, setStoredMapArray] = useLocalStorage(
    "storedMapCreationArray",
    [] as Tile[],
  )
  const [mapArray, setLocalMapArray] = useState(storedMapArray)
  const [mapCreationMode, setMapCreationMode] = useState<MapCreationMode>(
    mapArray.length > 0
      ? MAP_CREATION_MODES.MAP_TOPPINGS
      : MAP_CREATION_MODES.MAP_CREATION,
  )

  const setMapArray = (newMapArray: Tile[]) => {
    setLocalMapArray(newMapArray)
    setStoredMapArray(newMapArray)
  }

  const setMapSize = (newSize: number) => {
    setLocalMapSize(newSize)

    const newDevMap = createCreationMap({
      width: newSize,
      height: newSize,
    })

    setMapArray(newDevMap)
  }

  const mapObject = mapArray.reduce<{ [xyTileId: string]: Tile }>(
    (acc, tile) => {
      acc[tile.xyTileId] = tile
      return acc
    },
    {},
  )

  const commonProps = {
    setMapCreationMode,
    mapArray,
    setMapArray,
    mapSize,
    setMapSize,
    mapObject,
  }

  const renderMapCreationToolbar = () => {
    return (
      <>
        <div className="h-10" />
        <div className="self-center">
          <button
            className="rounded bg-blue-500 p-2 text-white hover:bg-blue-700"
            onClick={() => {
              setMapArray([])
              setMapCreationMode(MAP_CREATION_MODES.MAP_CREATION)
            }}
          >
            Clear Map
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
          <MapCreation {...commonProps} />
        </>
      )
    }
    case MAP_CREATION_MODES.MAP_TOPPINGS: {
      return (
        <>
          {renderMapCreationToolbar()}
          <MapToppings {...commonProps} />
        </>
      )
    }
  }
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreationWrapper

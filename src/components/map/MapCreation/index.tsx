import React, { useState } from "react"

import type { Tile } from "schema"
import { MapCreation } from "~/components/map/MapCreation/MapCreation"
import { MapToppings } from "~/components/map/MapCreation/MapToppings"
import {
  MAP_CREATION_MODES,
  DEFAULT_MAP_CREATION_SIZE,
  type MapCreationMode,
} from "~/components/map/MapCreation/constants"
import {
  createCreationMap,
  createDevMap,
} from "~/components/map/MapCreation/utils"
import { useLocalStorage } from "~/hooks/useLocalStorage"

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
    createCreationMap({
      width: mapSize,
      height: mapSize,
    }),
  )
  const [mapArray, setLocalMapArray] = useState(storedMapArray)
  const [mapCreationMode, setMapCreationMode] = useState<MapCreationMode>(
    MAP_CREATION_MODES.MAP_CREATION,
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

  const baseProps = {
    setMapCreationMode: setMapCreationMode,
    mapArray,
    setMapArray,
    mapSize,
    setMapSize,
  }

  switch (mapCreationMode) {
    case MAP_CREATION_MODES.MAP_CREATION: {
      return <MapCreation {...baseProps} />
    }
    case MAP_CREATION_MODES.MAP_TOPPINGS: {
      return <MapToppings {...baseProps} />
    }
  }
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreationWrapper

import React, { useState } from "react"
import dynamic from "next/dynamic"

import { useElementSize } from "~/hooks/useElementSize"
import { createMap } from "~/components/MapCreation/utils"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { produce } from "immer"
import type { Tile } from "schema"
import {
  TILE_TYPES,
  type TileType,
  TILE_TYPE_TO_TYPE_ID,
} from "~/components/constants"
import { ImageIcon } from "~/components/ImageIcon"
import { Switch } from "~/components/Switch"

const MapWrapper = dynamic(() => import("~/components/MapWrapper"), {
  ssr: false,
})

const CLICK_TYPES = {
  TILE: "TILE",
} as const

type ClickType = keyof typeof CLICK_TYPES

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreation = () => {
  const { sizeRef, size } = useElementSize()
  const [selectedTileType, setSelectedTileType] = useState<TileType>(
    TILE_TYPES.EMPTY,
  )
  const [clickType] = useState<ClickType>(CLICK_TYPES.TILE)
  const [isFloodFillActive, setFloodFillActiveState] = useState(false)
  const [mapSize] = useState({ width: 100, height: 100 })
  const [mapArray, setMapArray] = useState(
    createMap({
      width: mapSize.width,
      height: mapSize.height,
      hasRandomTypeId: true,
    }),
  )

  const updateMapTile = ({
    oldTile,
    newTile,
  }: {
    oldTile: Tile
    newTile: Partial<Tile>
  }) => {
    const newMapArray = produce(mapArray, (draftMapArray) => {
      const oldTileIndex = draftMapArray.findIndex(
        (tile) => oldTile.xyTileId === tile.xyTileId,
      )
      if (!oldTileIndex) throw Error("Trying to update a non existent tile!")
      draftMapArray[oldTileIndex] = { ...oldTile, ...newTile }
      return draftMapArray
    })
    setMapArray(newMapArray)
  }

  const floodFillMap = ({
    startingTile,
    fillTileType,
  }: {
    startingTile: Tile
    fillTileType: TileType
  }) => {
    const mapObject = mapArray.reduce<{ [key: string]: Tile }>((acc, tile) => {
      acc[tile.xyTileId] = tile
      return acc
    }, {})

    const queue = [startingTile.xyTileId]
    const visited = new Set<string>(startingTile.xyTileId)

    while (queue.length > 0) {
      const currentTileId = queue.shift()

      if (!currentTileId) throw Error("Queue should never be empty here!")

      // Skip if we have already visited the tile add to visited if we have not
      if (visited.has(currentTileId)) continue
      visited.add(currentTileId)

      // Skip if the tile does not exist (off the edges of the map)
      if (!mapObject.hasOwnProperty(currentTileId)) continue

      // get the currentTile
      const [xRaw, yRaw] = currentTileId.split(":")
      if (!xRaw || !yRaw)
        throw Error("XYTileId did was not formatted properly!")
      const x = parseInt(xRaw)
      const y = parseInt(yRaw)
      const currentTile = mapObject[`${x}:${y}`]
      if (!currentTile) throw Error("Tile should never be undefined here!")

      // If the current tile should be changed, change and continue.
      if (currentTile.type_id === startingTile.type_id) {
        mapObject[currentTileId] = {
          ...currentTile,
          type_id: TILE_TYPE_TO_TYPE_ID[fillTileType],
        }
        queue.push(
          `${x + 1}:${y}`,
          `${x - 1}:${y}`,
          `${x}:${y + 1}`,
          `${x}:${y - 1}`,
        )
      }
    }

    const newMapArray = Object.values(mapObject)
    setMapArray(newMapArray)
  }

  return (
    <div className="flex h-full flex-row p-10">
      <div className="w-2/3" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          {mapArray?.map((tile) => (
            <React.Fragment key={tile.xyTileId}>
              {/* <DumbPixiTileBorder {...tile} /> */}
              <DumbPixiTile
                key={tile.xyTileId}
                {...tile}
                interactive
                onclick={() => {
                  console.log("hello")
                  switch (clickType) {
                    case "TILE": {
                      if (isFloodFillActive) {
                        floodFillMap({
                          startingTile: tile,
                          fillTileType: selectedTileType,
                        })
                      } else {
                        updateMapTile({
                          oldTile: tile,
                          newTile: {
                            type_id: TILE_TYPE_TO_TYPE_ID[selectedTileType],
                          },
                        })
                      }
                    }
                  }
                }}
              />
            </React.Fragment>
          ))}
        </MapWrapper>
      </div>
      {/* TODO: convert this into a form */}
      <div className="flex flex-col gap-2 p-5">
        <div
          className={`relative flex flex-col p-2 ${
            clickType === "TILE" ? "outline outline-red-600" : ""
          }`}
        >
          <div className="flex flex-row gap-3 p-2">
            Flood Fill
            <Switch
              checked={isFloodFillActive}
              onCheckedChange={() =>
                setFloodFillActiveState(!isFloodFillActive)
              }
            />
          </div>
          {Object.values(TILE_TYPES).map((tileType) => (
            <button
              className={`flex w-fit items-center gap-2 p-1 ${
                tileType === selectedTileType
                  ? "outline outline-offset-[-0.15rem] outline-red-600"
                  : ""
              }`}
              onClick={() => {
                setSelectedTileType(tileType)
              }}
              key={tileType}
            >
              <ImageIcon icon={tileType} />
              {tileType}
            </button>
          ))}
          {clickType !== "TILE" && <Overlay />}
        </div>
      </div>
    </div>
  )
}

const Overlay = () => (
  <div className="absolute left-0 top-0 h-full w-full bg-black opacity-30" />
)

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreation

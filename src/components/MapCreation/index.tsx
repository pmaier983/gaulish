import React, { useState } from "react"
import dynamic from "next/dynamic"
import { produce } from "immer"

import { useElementSize } from "~/hooks/useElementSize"
import { createDevMap } from "~/components/MapCreation/utils"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { TILE_TYPES, type TileType } from "~/components/constants"
import { ImageIcon } from "~/components/ImageIcon"
import type { Tile } from "schema"

const MapWrapper = dynamic(() => import("~/components/MapWrapper"), {
  ssr: false,
})

const DevTileTest = dynamic(() => import("~/components/dev/DevTileTest"), {
  ssr: false,
})

const CLICK_TYPES = {
  TILE: "TILE",
} as const

type ClickType = keyof typeof CLICK_TYPES

const MAP_WIDTH = 100
const MAP_HEIGHT = 100

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreation = () => {
  return <DevTileTest />
  const { sizeRef, size } = useElementSize()
  const [selectedTileType, setSelectedTileType] = useState<TileType>(
    TILE_TYPES.EMPTY,
  )
  const [clickType] = useState<ClickType>(CLICK_TYPES.TILE)
  const [mapArray, setMapArray] = useState(
    createDevMap({
      width: MAP_WIDTH,
      height: MAP_HEIGHT,
    }),
  )

  const updateMapTile = ({
    oldTile,
    newTile,
  }: {
    oldTile: Tile
    newTile: Partial<Tile>
  }) => {
    const mapObject = mapArray.reduce<{ [xyTileId: string]: Tile }>(
      (acc, tile) => {
        acc[tile.xyTileId] = tile
        return acc
      },
      {},
    )

    const newMapObject = produce(mapObject, (draftMapObject) => {
      const oldTileIndex = mapObject[oldTile.xyTileId]
      if (!oldTileIndex) throw Error("Trying to update a non existent tile!")
      // For all four directions
      const directions: [number, number][] = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ]

      // When adding everything but ocean, make all nearby ocean tiles empty
      if (newTile.type !== TILE_TYPES.OCEAN) {
        directions.forEach(([x, y]) => {
          const neighborTile = mapObject[`${oldTile.x + x}:${oldTile.y + y}`]
          if (!neighborTile) return
          if (neighborTile.type !== TILE_TYPES.OCEAN) return
          draftMapObject[neighborTile.xyTileId] = {
            ...neighborTile,
            type: "EMPTY",
          }
        })
      }

      draftMapObject[oldTileIndex.xyTileId] = { ...oldTile, ...newTile }
      return draftMapObject
    })

    setMapArray(Object.values(newMapObject))
  }

  return (
    <div className="flex h-full flex-row p-10">
      <div className="w-2/3" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          {mapArray?.map((tile) => (
            <React.Fragment key={tile.xyTileId}>
              <DumbPixiTile
                key={tile.xyTileId}
                {...tile}
                interactive
                onclick={() => {
                  switch (clickType) {
                    case "TILE": {
                      updateMapTile({
                        oldTile: tile,
                        newTile: {
                          type: selectedTileType,
                        },
                      })
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

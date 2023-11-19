import { produce } from "immer"
import dynamic from "next/dynamic"
import React, { useState } from "react"
import type { Tile } from "schema"
import { ImageIcon } from "~/components/ImageIcon"
import {
  CARDINAL_DIRECTIONS_ARRAY,
  TILE_TYPES,
  type TileType,
} from "~/components/constants"
import { InteractiveGroupedMap } from "~/components/map/MapCreation/InteractiveGroupedMap"
import type { SetMapCreationMode } from "~/components/map/MapCreation/constants"
import { createCreationMap } from "~/components/map/MapCreation/utils"
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

interface MapCreationProps {
  className?: string
  mapArray: Tile[]
  mapObject: { [xyTileId: string]: Tile }
  setMapCreationMode: SetMapCreationMode
  setMapArray: (newMapArray: Tile[]) => void
  mapSize: number
  setMapSize: (newSize: number) => void
}

export const MapCreation = ({
  className,
  mapArray,
  mapObject,
  setMapArray,
  mapSize,
}: MapCreationProps) => {
  const { sizeRef, size } = useElementSize()
  const [selectedTileType, setSelectedTileType] = useState<TileType>("EMPTY")

  return (
    <div className={`${className} flex h-full flex-row p-10`}>
      <div className="w-2/3" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          <InteractiveGroupedMap
            mapArray={mapArray}
            setMapArray={setMapArray}
            mapObject={mapObject}
            selectedTileType={selectedTileType}
          />
        </MapWrapper>
      </div>
      {/* TODO: convert this into a form */}
      <div className="flex flex-col gap-2 p-5">
        <div className={`relative flex flex-col p-2 outline outline-red-600`}>
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
        </div>
        <div className="flex flex-row gap-2 p-2">
          <button
            className="rounded-sm bg-red-400 px-3"
            onClick={() => {
              setMapArray(
                createCreationMap({
                  width: mapSize,
                  height: mapSize,
                }),
              )
            }}
          >
            Reset Map
          </button>
          <button
            className="rounded-sm bg-blue-400 px-3"
            onClick={() => {
              setMapArray(
                mapArray.map((tile) =>
                  tile.type === "EMPTY"
                    ? {
                        ...tile,
                        type: "OCEAN",
                      }
                    : tile,
                ),
              )
            }}
          >
            Empty to Ocean
          </button>
          <button
            className="rounded-sm border border-black px-3"
            onClick={() => {
              setMapArray(
                mapArray.map((tile) =>
                  tile.type === "OCEAN"
                    ? {
                        ...tile,
                        type: "EMPTY",
                      }
                    : tile,
                ),
              )
            }}
          >
            Ocean to Empty
          </button>
          <button
            className="rounded-sm bg-green-400 px-3"
            onClick={() => {
              setMapArray(
                mapArray.map((tile) => {
                  if (tile.type === "OCEAN") {
                    const isNearIsland = CARDINAL_DIRECTIONS_ARRAY.reduce(
                      (acc, [x, y]) => {
                        if (
                          !["OCEAN", "EMPTY"].includes(
                            mapObject[`${tile.x + x}:${tile.y + y}`]!.type,
                          )
                        ) {
                          return true
                        }
                        return acc
                      },
                      false,
                    )
                    if (!isNearIsland) return tile
                    return {
                      ...tile,
                      type: "EMPTY",
                    }
                  }
                  return tile
                }),
              )
            }}
          >
            Outline Islands
          </button>
        </div>
      </div>
    </div>
  )
}

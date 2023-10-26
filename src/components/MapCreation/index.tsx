import { useState } from "react"
import dynamic from "next/dynamic"

import { useElementSize } from "~/hooks/useElementSize"
import { createMap } from "~/components/MapCreation/utils"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { DumbPixiTileBorder } from "~/components/pixi/DumbPixiTileBorder"

const MapWrapper = dynamic(() => import("~/components/MapWrapper"), {
  ssr: false,
})

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreation = () => {
  const { sizeRef, size } = useElementSize()
  const [mapSize, setMapSize] = useState(10)
  const [mapArray, setMapArray] = useState(createMap(mapSize, mapSize))

  return (
    <div className="flex h-full flex-row p-10">
      <div className="w-2/3" ref={sizeRef}>
        <MapWrapper mapHeight={size.height} mapWidth={size.width}>
          {mapArray?.map((tile) => (
            <>
              <DumbPixiTileBorder {...tile} />
              <DumbPixiTile key={tile.xyTileId} {...tile} />
            </>
          ))}
        </MapWrapper>
      </div>
      {/* TODO: convert this into a form */}
      <div className="p-5">
        <div className="flex flex-row items-center gap-3">
          Map size:
          <input
            className="border border-black bg-gray-300"
            type="number"
            value={mapSize}
            onChange={(e) => setMapSize(parseInt(e.target.value))}
          />
          <button
            className="rounded border border-red-800 bg-red-500 p-1"
            onClick={() => {
              setMapArray(createMap(mapSize, mapSize))
            }}
          >
            Set Map Size
          </button>
        </div>
      </div>

      {/* <div className="flex">
        <PixiStage
          width={mapWidth}
          height={mapWidth}
          options={{ backgroundColor: 0xaaaaaa }}
        >
          <PixiViewport width={mapWidth} height={mapWidth}>
            {cellMap.map((row, y) =>
              row.map((cell, x) => {
                // TODO: use `useApp` and app.renderer.options.width instead of mapWidth
                const cellXPosition = mapWidth * x * cell.percentSize
                const cellYPosition = mapWidth * y * cell.percentSize

                if (cell.type === TILE_TYPES.EMPTY) {
                  return (
                    <DumbPixiEmptyTile
                      key={`${x}:${y}`}
                      fill="#fff"
                      x={cellXPosition}
                      y={cellYPosition}
                      percentSize={cell.percentSize}
                      interactive={true}
                      onclick={() => {
                        setCellMap(
                          modifyCellInMap(cellMap, x, y, {
                            type: cellSelectionType,
                          }),
                        )
                      }}
                    />
                  )
                } else {
                  return (
                    <Sprite
                      key={`${x}:${y}`}
                      x={cellXPosition}
                      y={cellYPosition}
                      width={mapWidth * cell.percentSize}
                      height={mapWidth * cell.percentSize}
                      image={`/${cell.type.toLocaleLowerCase()}.webp`}
                      interactive={true}
                      onclick={() => {
                        setCellMap(
                          modifyCellInMap(cellMap, x, y, {
                            type: cellSelectionType,
                          }),
                        )
                      }}
                    />
                  )
                }
              }),
            )}
          </PixiViewport>
        </PixiStage>
        <div className="flex-col">
          {Object.values(TILE_TYPES).map((type) => (
            <Image
              key={type}
              className={
                type === cellSelectionType
                  ? "outline outline-2 outline-red-700"
                  : ""
              }
              src={`/assets/tiles/${type.toLocaleLowerCase()}.webp`}
              width={mapWidth / Object.values(TILE_TYPES).length}
              height={mapWidth / Object.values(TILE_TYPES).length}
              alt={`${type} pixi cell type`}
              onClick={() => setCellSelectionType(type)}
            />
          ))}
        </div>
      </div> */}
    </div>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreation

import { PixiViewport } from "~/components/pixi/PixiViewport"
import { PixiStage } from "~/components/pixi/PixiStage"
import { DumbPixiEmptyTile } from "~/components/pixi/DumbPixiEmptyTile"
import { createArraySquare } from "~/utils/utils"
import { useState } from "react"
import Image from "next/image"
import { Sprite } from "@pixi/react"
import { produce } from "immer"
import {
  type TILE_TYPE,
  TILE_TYPES,
  TILE_TYPE_TO_TYPE_ID,
} from "~/components/constants"

interface PixiCell {
  x: number
  y: number
  percentSize: number
  type: TILE_TYPE
}

type CellMap = PixiCell[][]

const initialCellMap = createArraySquare<Omit<PixiCell, "x" | "y">>({
  size: 7,
  tile: { type: TILE_TYPES.EMPTY, percentSize: 0.04 },
})

const modifyCellInMap = (
  cellMap: CellMap,
  x: number,
  y: number,
  modifiedCell: Partial<PixiCell>,
) => {
  return produce<CellMap>(cellMap, (draft) => {
    if (draft?.[y]?.[x]) {
      const row = draft[y]
      const currentCell = row?.[x]
      if (currentCell) {
        row[x] = { ...currentCell, ...modifiedCell }
      }
    }
  })
}

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreation = () => {
  const [cellSelectionType, setCellSelectionType] = useState<TILE_TYPE>(
    TILE_TYPES.EMPTY,
  )
  const [cellMap, setCellMap] = useState<CellMap>(initialCellMap)

  const mapWidth = 200

  return (
    <>
      <div className="flex">
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
                type === cellSelectionType ? "border-2 border-red-700" : ""
              }
              src={`/${type.toLocaleLowerCase()}.webp`}
              width={mapWidth / Object.values(TILE_TYPES).length}
              height={mapWidth / Object.values(TILE_TYPES).length}
              alt={`${type} pixi cell type`}
              onClick={() => setCellSelectionType(type)}
            />
          ))}
        </div>
      </div>
      <button
        onClick={() => {
          const allCells = cellMap.reduce<string[]>((acc, row) => {
            const sqlROW = row.map((cell) => {
              return `(${cell.x}, ${cell.y}, ${
                TILE_TYPE_TO_TYPE_ID[cell.type]
              })`
            })
            return acc.concat(sqlROW)
          }, [])

          const precedingText = `INSERT INTO gaulish.tile (x, y, type_id) VALUES `
          console.log("COPIED TEXT", precedingText + allCells.join(", ") + ";")
          void navigator.clipboard.writeText(
            precedingText + allCells.join(", ") + ";",
          )
        }}
      >
        Copy SQL to Clipboard
      </button>
    </>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreation

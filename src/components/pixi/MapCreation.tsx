import { PixiViewport } from "~/components/pixi/PixiViewport"
import { PixiStage } from "~/components/pixi/PixiStage"
import { PixiEmptyCell } from "~/components/pixi/PixiEmptyCell"
import { createArraySquare } from "~/utils/utils"

const CELL_TYPES = {
  EMPTY: "EMPTY",
  FOREST: "FOREST",
  GRASSLAND: "GRASSLAND",
  MOUNTAIN: "MOUNTAIN",
  OCEAN: "OCEAN",
} as const

export type CELL_TYPE = keyof typeof CELL_TYPES

interface PixiCell {
  x: number
  y: number
  percentSize: number
  type: CELL_TYPE
}

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreation = () => {
  const mapWidth = 500

  const cellMap = createArraySquare<Omit<PixiCell, "x" | "y">>({
    size: 20,
    cell: { type: CELL_TYPES.EMPTY, percentSize: 1 },
  })

  return (
    <PixiStage
      width={mapWidth}
      height={mapWidth}
      options={{ backgroundColor: 0xaaaaaa }}
    >
      <PixiViewport width={mapWidth} height={mapWidth}>
        {cellMap.map((row, y) =>
          row.map((cell, x) => {
            const cellXPosition = mapWidth * x * cell.percentSize
            const cellYPosition = mapWidth * y * cell.percentSize

            return (
              <PixiEmptyCell
                key={`${x}:${y}`}
                fill="#fff"
                x={cellXPosition}
                y={cellYPosition}
                percentSize={cell.percentSize}
                interactive={true}
              />
            )
          }),
        )}
      </PixiViewport>
    </PixiStage>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreation

import { Text, type _ReactPixi } from "@pixi/react"
import { TILE_SIZE } from "~/components/constants"

interface DumbPixiTileTextProps extends _ReactPixi.IText {
  x: number
  y: number
  size?: number
  width?: number
  height?: number
}

export const DumbPixiTileText = ({
  size = TILE_SIZE,
  width = TILE_SIZE / 2,
  height = TILE_SIZE / 2,
  ...props
}: DumbPixiTileTextProps) => {
  const x = props.x * size
  const y = props.y * size
  return <Text {...props} x={x} y={y} width={width} height={height} />
}

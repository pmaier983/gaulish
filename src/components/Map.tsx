import { PixiEmptyCell } from "~/components/pixi/PixiEmptyCell"
import { PixiStage } from "~/components/pixi/PixiStage"
import { PixiViewport } from "~/components/pixi/PixiViewport"

/**
  Generic Map Component. Mainly to render the main game map

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const Map = ({ width, height }: { width: number; height: number }) => {
  return (
    <PixiStage
      width={width}
      height={height}
      options={{ backgroundColor: 0xaaaaaa }}
    >
      <PixiViewport width={width} height={height}>
        <PixiEmptyCell
          key={`${1}:${1}`}
          fill="#fff"
          x={10}
          y={10}
          percentSize={0.05}
          interactive={true}
        />
      </PixiViewport>
    </PixiStage>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default Map

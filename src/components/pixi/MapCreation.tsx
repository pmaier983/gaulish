import { Sprite, Stage } from "@pixi/react"
import { PixiViewport } from "~/components/pixi/PixiViewport"

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreation = () => {
  const size = 500

  return (
    <Stage width={size} height={size}>
      <PixiViewport width={size} height={size}>
        <Sprite
          x={0}
          y={0}
          height={10}
          width={10}
          image="/grass.webp"
          interactive={true}
          onclick={(e) => console.log("click", e)}
        />
      </PixiViewport>
    </Stage>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreation

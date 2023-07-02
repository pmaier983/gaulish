import { Graphics, Sprite } from "@pixi/react"
import { useState } from "react"

import { PixiViewport } from "~/components/pixi/PixiViewport"
import { PixiStage } from "~/components/pixi/PixiStage"

/**
  First attempt at map creation using PixiJS and the PixiViewport library.
  Only import using dynamic (as PixieViewport requires the window object)

  @example import method
  const MapCreation = dynamic(() => import("somewhere"), {ssr: false})
*/
const MapCreation = () => {
  const [mapSize, setMapSize] = useState(500)

  return (
    <PixiStage width={mapSize} height={mapSize}>
      <PixiViewport width={mapSize} height={mapSize}>
        <Sprite
          x={0}
          y={0}
          height={10}
          width={10}
          image="/grass.webp"
          interactive={true}
          onclick={(e) => console.log("click", e)}
        />
        <Graphics
          draw={(g) => {
            g.clear()
            g.beginFill("#fff")
            g.drawRect(10, 10, 10, 10)
            g.endFill()
          }}
        />
      </PixiViewport>
    </PixiStage>
  )
}

// Only use dynamic import with this component (see above)!
// eslint-disable-next-line import/no-default-export
export default MapCreation

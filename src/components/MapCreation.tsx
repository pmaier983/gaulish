import { Sprite, Stage } from "@pixi/react"
import { PixiViewport } from "~/components/PixiViewport"

const MapCreation = () => {
  return (
    <Stage width={100} height={100} options={{ backgroundColor: 0x1099bb }}>
      <PixiViewport width={100} height={100}>
        <Sprite x={20} y={20} anchor={0.5} image="/grass.webp" />
      </PixiViewport>
    </Stage>
  )
}

export default MapCreation

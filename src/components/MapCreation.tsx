import { Sprite, Stage } from "@pixi/react"
import { PixieViewport } from "~/components/PixieViewport"

import grass from "~/../public/grass.png"

export const MapCreation = () => {
  return (
    <Stage width={100} height={100} options={{ backgroundColor: 0x1099bb }}>
      <PixieViewport width={100} height={100}>
        <Sprite x={20} y={20} anchor={0.5} image={grass} />
      </PixieViewport>
    </Stage>
  )
}

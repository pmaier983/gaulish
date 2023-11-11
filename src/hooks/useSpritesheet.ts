import { useAtom } from "jotai"
import * as PIXI from "pixi.js"
import { useEffect } from "react"

import type spritesheet from "~/../public/assets/spritesheet.json"
import { spritesheetStateAtom } from "~/state/atoms"

type Spritesheet = PIXI.Spritesheet<typeof spritesheet>

export interface SpritesheetState {
  isSpritesheetLoaded: boolean
  spritesheet: Spritesheet
}

// Must load the pixi data before rendering the Pixi Stage!
// Especially when using cacheAsBitmap!!!
export const useSpritesheet = () => {
  const [, setSpritesheet] = useAtom(spritesheetStateAtom)

  /**
   * Load all the pixi data, and on completion set isSpritesheetLoaded to true
   */
  useEffect(() => {
    const loadPixiData = async () => {
      // Load the Spritesheet
      const loadedSpritesheet = await PIXI.Assets.load<Spritesheet>(
        "/assets/spritesheet.json",
      )

      console.log(loadedSpritesheet)

      // Once everything is loaded, set isSpritesheetLoaded to true
      setSpritesheet({
        spritesheet: loadedSpritesheet,
        isSpritesheetLoaded: true,
      })
    }

    void loadPixiData()
  }, [setSpritesheet])
}

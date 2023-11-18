import { Graphics } from "@pixi/react"
import { useCallback } from "react"
import type * as PIXI from "pixi.js"

import type {
  KnownTilesObject,
  VisibleTilesObject,
} from "~/state/gamestateStore"
import type { Tile } from "schema"
import { TILE_SIZE } from "~/components/constants"

interface MapPixiOverlaysProps {
  mapArray: Tile[]
  visibleTilesObject: VisibleTilesObject
  knownTilesObject: KnownTilesObject
}

export const MapPixiOverlays = ({
  mapArray,
  visibleTilesObject,
  knownTilesObject,
}: MapPixiOverlaysProps) => {
  const drawNonKnowTilesOverlay = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()

      mapArray.forEach((tile) => {
        if (knownTilesObject.hasOwnProperty(tile.xyTileId)) return

        g.beginFill(0x000000, 1)
        g.drawRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        g.endFill()
      })
    },
    [knownTilesObject, mapArray],
  )

  const drawNonVisibleTilesOverlay = useCallback(
    (g: PIXI.Graphics) => {
      g.clear()

      mapArray.forEach((tile) => {
        if (visibleTilesObject.hasOwnProperty(tile.xyTileId)) return

        g.beginFill(0x000000, 0.65)
        g.drawRect(tile.x * TILE_SIZE, tile.y * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        g.endFill()
      })
    },
    [mapArray, visibleTilesObject],
  )

  return (
    <>
      <Graphics draw={drawNonKnowTilesOverlay} />
      <Graphics draw={drawNonVisibleTilesOverlay} />
    </>
  )
}

import { useCallback } from "react"
import { type Tile } from "schema"
import { DumbPixiShip } from "~/components/pixi/DumbPixiShip"

import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { useGamestateStore } from "~/state/gamestateStore"

export const MapPixiTile = (tile: Tile) => {
  const tileKey = `${tile.x}:${tile.y}`
  const { mapObject } = useGamestateStore(
    useCallback((state) => ({ mapObject: state.mapObject }), []),
  )
  const npc = mapObject[tileKey]?.npc
  // console.log(mapObject[tileKey])
  return (
    <>
      <DumbPixiTile {...tile} />
      {npc && <DumbPixiShip {...tile} />}
    </>
  )
}

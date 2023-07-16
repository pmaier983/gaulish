import { useCallback } from "react"
import { type Tile } from "schema"

import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { useGamestateStore } from "~/state/gamestateStore"

export const MapPixiTile = (tile: Tile) => {
  const tileKey = `${tile.x}:${tile.y}`
  const { mapObject } = useGamestateStore(
    useCallback((state) => ({ mapObject: state.mapObject }), []),
  )
  // console.log(mapObject[tileKey])
  return <DumbPixiTile tile={tile} npc={mapObject[tileKey]?.npc} />
}

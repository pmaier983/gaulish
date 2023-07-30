import { useCallback } from "react"
import { type Tile } from "schema"
import { DumbPixiCity } from "~/components/pixi/DumbPixiCity"
import { DumbPixiShip } from "~/components/pixi/DumbPixiShip"

import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { useGamestateStore } from "~/state/gamestateStore"

export const MapPixiTile = (tile: Tile) => {
  const { mapObject, cityObject } = useGamestateStore(
    useCallback(
      (state) => ({ mapObject: state.mapObject, cityObject: state.cityObject }),
      [],
    ),
  )
  const currentTile = mapObject[tile.xyTileId]
  const npc = currentTile?.npc
  const city = cityObject[tile.xyTileId]
  return (
    <>
      <DumbPixiTile {...tile} />
      {npc && <DumbPixiShip tile={tile} npc={npc} />}
      {city && <DumbPixiCity tile={tile} city={city} />}
    </>
  )
}

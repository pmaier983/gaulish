import { useCallback } from "react"
import { type Tile } from "schema"
import { DumbPixiCity } from "~/components/pixi/DumbPixiCity"
import { DumbPixiShip } from "~/components/pixi/DumbPixiShip"
import { DumbPixiShipPath } from "~/components/pixi/DumbPixiShipPath"

import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { useGamestateStore } from "~/state/gamestateStore"

export const MapPixiTile = (tile: Tile) => {
  const { mapObject, cityObject, selectedShipPathObject } = useGamestateStore(
    useCallback(
      (state) => ({
        mapObject: state.mapObject,
        cityObject: state.cityObject,
        selectedShipPathObject: state.selectedShipPathObject,
      }),
      [],
    ),
  )
  const currentTile = mapObject[tile.xyTileId]
  const npc = currentTile?.npc
  const ship = currentTile?.ship

  const city = cityObject[tile.xyTileId]
  const shipPath = selectedShipPathObject[tile.xyTileId]

  return (
    <>
      <DumbPixiTile {...tile} />
      {npc && <DumbPixiShip tile={tile} isEnemy={true} name={npc.name} />}
      {ship && <DumbPixiShip tile={tile} isEnemy={false} name={ship.name} />}
      {city && <DumbPixiCity tile={tile} city={city} />}
      {shipPath && <DumbPixiShipPath tile={tile} selectedShipPath={shipPath} />}
    </>
  )
}

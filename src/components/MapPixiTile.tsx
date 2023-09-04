import { type Tile } from "schema"

import { DumbPixiCity } from "~/components/pixi/DumbPixiCity"
import { DumbPixiOverlay } from "~/components/pixi/DumbPixiOverlay"
import { DumbPixiShip } from "~/components/pixi/DumbPixiShip"
import { DumbPixiShipPath } from "~/components/pixi/DumbPixiShipPath"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"
import { useGamestateStore } from "~/state/gamestateStore"

export const MapPixiTile = (tile: Tile) => {
  const { mapObject, cityObject, selectedShipPathObject, visibleTilesObject } =
    useGamestateStore((state) => ({
      mapObject: state.mapObject,
      cityObject: state.cityObject,
      selectedShipPathObject: state.selectedShipPathObject,
      visibleTilesObject: state.visibleTilesObject,
    }))

  const isTileVisible = visibleTilesObject[tile.xyTileId]

  const currentTile = mapObject[tile.xyTileId]
  const npc = currentTile?.npc
  const ship = currentTile?.ship

  const city = cityObject[tile.xyTileId]
  const shipPath = selectedShipPathObject[tile.xyTileId]

  return (
    <>
      <DumbPixiTile {...tile} />
      {isTileVisible && npc && (
        <DumbPixiShip tile={tile} isEnemy={true} name={npc.name} />
      )}
      {isTileVisible && ship && (
        <DumbPixiShip tile={tile} isEnemy={false} name={ship.name} />
      )}
      {city && <DumbPixiCity tile={tile} city={city} />}
      {shipPath && <DumbPixiShipPath tile={tile} selectedShipPath={shipPath} />}
      {!isTileVisible && <DumbPixiOverlay tile={tile} />}
    </>
  )
}

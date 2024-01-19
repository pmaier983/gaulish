import { memo } from "react"
import type { Tile } from "schema"

import { DumbPixiCity } from "~/components/pixi/DumbPixiCity"
import { DumbPixiShip } from "~/components/pixi/DumbPixiShip"
import { DumbPixiShipPath } from "~/components/pixi/DumbPixiShipPath"
import { useGamestateStore } from "~/state/gamestateStore"

export const MapPixiOverTiles = memo(() => {
  const {
    mapArray,
    mapObject,
    cityObject,
    selectedShipPathArray,
    knownTilesObject,
    visibleTilesObject,
  } = useGamestateStore((state) => ({
    mapArray: state.mapArray,
    mapObject: state.mapObject,
    cityObject: state.cityObject,
    selectedShipPathArray: state.selectedShipPathArray,
    knownTilesObject: state.knownTilesObject,
    visibleTilesObject: state.visibleTilesObject,
  }))

  // TODO: Simplify the store so we don't need to do this!
  const { npcTiles, shipTiles, cityTiles } = mapArray.reduce<{
    cityTiles: Tile[]
    npcTiles: Tile[]
    shipTiles: Tile[]
  }>(
    (acc, tile) => {
      const mapTile = mapObject[tile.xyTileId]
      if (!mapTile) throw Error("mapArray has a tile that mapObject does not!")

      // If the tile is unknown, don't render anything below
      if (!knownTilesObject.hasOwnProperty(tile.xyTileId)) return acc

      if (cityObject[tile.xyTileId]) {
        acc["cityTiles"] = [...acc["cityTiles"], tile]
      }

      // If the tile is not currently visible don't show the ship or npcs
      if (!visibleTilesObject.hasOwnProperty(tile.xyTileId)) return acc

      if (mapTile?.npc) {
        acc["npcTiles"] = [...acc["npcTiles"], tile]
      }

      if (mapTile?.ship) {
        acc["shipTiles"] = [...acc["shipTiles"], tile]
      }

      return acc
    },
    {
      cityTiles: [],
      npcTiles: [],
      shipTiles: [],
    },
  )

  return (
    <>
      {npcTiles.map((tile) => {
        const currentMapTile = mapObject[tile.xyTileId]
        if (!currentMapTile)
          throw Error("mapArray has a tile that mapObject does not!")
        return (
          <DumbPixiShip
            key={`npc-${tile.xyTileId}`}
            tile={tile}
            isEnemy={true}
            name={currentMapTile.npc!.name}
          />
        )
      })}
      {shipTiles.map((tile) => {
        const currentMapTile = mapObject[tile.xyTileId]
        if (!currentMapTile)
          throw Error("mapArray has a tile that mapObject does not!")
        return (
          <DumbPixiShip
            key={`playerShip-${tile.xyTileId}`}
            tile={tile}
            isEnemy={false}
            name={currentMapTile.ship!.name}
          />
        )
      })}
      {cityTiles.map((tile) => {
        const city = cityObject[tile.xyTileId]
        if (!city) throw Error("mapArray has a tile that cityObject does not!")
        return <DumbPixiCity key={`city-${tile.xyTileId}`} city={city} />
      })}
      <DumbPixiShipPath shipPath={selectedShipPathArray} />
    </>
  )
})

MapPixiOverTiles.displayName = "MapPixiOverTile"

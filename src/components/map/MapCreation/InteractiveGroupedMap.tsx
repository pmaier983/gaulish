import { Container } from "@pixi/react"
import { produce } from "immer"

import type { Tile } from "schema"
import type { TileType } from "~/components/constants"
import { DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE } from "~/components/map/MapCreation/constants"
import { getTileGroups } from "~/components/map/MapCreation/utils"
import { DumbPixiTile } from "~/components/pixi/DumbPixiTile"

interface InteractiveGroupedMapProps {
  mapArray: Tile[]
  mapObject: { [xyTileId: string]: Tile }
  setMapArray: (newMapArray: Tile[]) => void
  selectedTileType: TileType
}

export const InteractiveGroupedMap = ({
  mapArray,
  mapObject,
  setMapArray,
  selectedTileType,
}: InteractiveGroupedMapProps) => {
  const groupedTiles = getTileGroups({
    tiles: mapArray,
    tileGroupSize: DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE,
  })

  const updateMapTile = ({
    oldTile,
    newTile,
  }: {
    oldTile: Tile
    newTile: Partial<Tile>
  }) => {
    const newMapObject = produce(mapObject, (draftMapObject) => {
      const oldTileIndex = mapObject[oldTile.xyTileId]
      if (!oldTileIndex) throw Error("Trying to update a non existent tile!")
      // For all four directions
      const directions: [number, number][] = [
        [-1, 0],
        [0, -1],
        [1, 0],
        [0, 1],
      ]

      // When adding everything but ocean, make all nearby ocean tiles empty
      if (newTile.type !== "OCEAN") {
        directions.forEach(([x, y]) => {
          const neighborTile = mapObject[`${oldTile.x + x}:${oldTile.y + y}`]
          if (!neighborTile) return
          if (neighborTile.type !== "OCEAN") return
          draftMapObject[neighborTile.xyTileId] = {
            ...neighborTile,
            type: "EMPTY",
          }
        })
      }

      draftMapObject[oldTileIndex.xyTileId] = { ...oldTile, ...newTile }
      return draftMapObject
    })

    const newMapArray = Object.values(newMapObject)

    setMapArray(newMapArray)
  }

  return (
    <>
      {groupedTiles.map((tileGroup) => {
        const firstTileOfGroup = tileGroup.at(0)

        if (!firstTileOfGroup)
          throw Error("Found a tile group without any content")

        const groupX = Math.floor(
          firstTileOfGroup.x / DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE,
        )

        const groupY = Math.floor(
          firstTileOfGroup.y / DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE,
        )

        return (
          <Container
            key={`groupedTiles-${groupX}:${groupY}`}
            cacheAsBitmap={true}
          >
            {tileGroup.map((tile) => {
              return (
                <DumbPixiTile
                  key={`tile-${tile.xyTileId}`}
                  {...tile}
                  onclick={() => {
                    updateMapTile({
                      oldTile: tile,
                      newTile: {
                        type: selectedTileType,
                      },
                    })
                  }}
                  onmouseover={(event) => {
                    if (event.shiftKey) {
                      updateMapTile({
                        oldTile: tile,
                        newTile: {
                          type: selectedTileType,
                        },
                      })
                    }
                  }}
                />
              )
            })}
          </Container>
        )
      })}
    </>
  )
}

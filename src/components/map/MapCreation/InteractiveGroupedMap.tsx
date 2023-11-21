import { produce } from "immer"
import { Fragment, useState } from "react"

import type { Tile } from "schema"
import { TILE_SIZE, type TileType } from "~/components/constants"
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
  const [focusedGroupedIndex, setFocusedGroupedIndex] = useState(0)

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

      draftMapObject[oldTileIndex.xyTileId] = { ...oldTile, ...newTile }
      return draftMapObject
    })

    const newMapArray = Object.values(newMapObject)

    setMapArray(newMapArray)
  }

  return (
    <>
      {groupedTiles.map((tileGroup, groupIndex) => {
        const firstTileOfGroup = tileGroup.at(0)

        if (!firstTileOfGroup)
          throw Error("Found a tile group without any content")

        const groupX = Math.floor(
          firstTileOfGroup.x / DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE,
        )

        const groupY = Math.floor(
          firstTileOfGroup.y / DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE,
        )

        const isFocusedGroup = focusedGroupedIndex === groupIndex

        if (!isFocusedGroup) {
          return (
            <DumbPixiTile
              key={`groupedTileOverlay-${groupX}:${groupY}`}
              x={groupX}
              y={groupY}
              size={DEFAULT_MAP_CREATION_GROUPED_TILES_SIZE * TILE_SIZE}
              type={"EMPTY"}
              interactive
              onclick={() => {
                setFocusedGroupedIndex(groupIndex)
              }}
            />
          )
        }

        return (
          <Fragment key={`tiles-${groupX}:${groupY}`}>
            {tileGroup.map((tile) => {
              return (
                <DumbPixiTile
                  key={`tile-${tile.xyTileId}`}
                  {...tile}
                  interactive
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
          </Fragment>
        )
      })}
    </>
  )
}

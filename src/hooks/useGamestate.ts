import { produce } from "immer"
import { useCallback, useEffect } from "react"
import { type MapObject, useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

let gamestateLoopRenderCount = 0

export const useGamestate = () => {
  const {
    setMapArray,
    setNpcs,
    setMapObject,
    setCleanMapObject,
    cleanMapObject,
    npcs,
  } = useGamestateStore(
    useCallback(
      (state) => ({
        setMapArray: state.setMapArray,
        setNpcs: state.setNpcs,
        setMapObject: state.setMapObject,
        setCleanMapObject: state.setCleanMapObject,
        cleanMapObject: state.cleanMapObject,
        npcs: state.npcs,
      }),
      [],
    ),
  )

  const { data: mapData } = api.general.getAllTiles.useQuery(undefined, {
    staleTime: Infinity,
  })

  // TODO: handle NPC's
  const { data: npcData } = api.general.getNpcs.useQuery(undefined, {
    staleTime: Infinity,
  })

  // Old code from the previous version of the game.
  useEffect(() => {
    console.log("gamestate loop render count:", gamestateLoopRenderCount++)
    const intervalId = setInterval(() => {
      const newMapObject = produce(cleanMapObject, (draftMapObject) => {
        npcs.forEach((npc) => {
          const {
            path: { createdAt, path },
            ship: { speed },
          } = npc

          const timePassed = Date.now() - createdAt.getMilliseconds()
          const tilesMoved = Math.floor(timePassed / speed)
          const pathKey = path[tilesMoved % path.length]
          if (!pathKey)
            throw new Error(
              `Math is wrong when calculating pathKey. Info: ${JSON.stringify(
                npc,
              )}`,
            )
          const currentTile = draftMapObject[pathKey]
          if (!currentTile)
            throw new Error(
              `Tried to access a non-existent tile. Info: ${JSON.stringify(
                npc,
              )}`,
            )
          draftMapObject[pathKey] = { ...currentTile, npc }
        })
      })
      setMapObject(newMapObject)
    }, 1000)
    return () => clearInterval(intervalId)
  })

  /**
   * Instantiate the npcs (Should only happen once)
   */
  useEffect(() => {
    setNpcs(npcData ?? [])
  }, [npcData, setNpcs])

  /**
   * Instantiate the map (Should only happen once)
   */
  useEffect(() => {
    setMapArray(mapData ?? [])

    const theCleanMapObject =
      mapData?.reduce<MapObject>((acc, tile) => {
        acc[`${tile.x}:${tile.y}`] = tile
        return acc
      }, {}) ?? {}

    setMapObject(theCleanMapObject)
    setCleanMapObject(theCleanMapObject)
  }, [mapData, setCleanMapObject, setMapArray, setMapObject])
}

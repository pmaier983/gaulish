import { produce } from "immer"
import { useCallback, useEffect } from "react"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

export const useGamestate = () => {
  const { setMap, setNpcs, setCities, cleanMapObject, npcs } =
    useGamestateStore(
      useCallback(
        (state) => ({
          setMap: state.setMap,
          setCities: state.setCities,
          setNpcs: state.setNpcs,
          cleanMapObject: state.cleanMapObject,
          npcs: state.npcs,
        }),
        [],
      ),
    )

  const { data: mapData } = api.general.getAllTiles.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when fetching the tiles",
    },
  })

  /**
   * Instantiate the map (Should only happen once)
   */
  useEffect(() => {
    setMap(mapData ?? [])
  }, [mapData, setMap])

  const { data: npcData } = api.general.getNpcs.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when fetching the npcs",
    },
  })

  /**
   * Instantiate the npcs (Should only happen once)
   */
  useEffect(() => {
    setNpcs(npcData ?? [])
  }, [npcData, setNpcs])

  const { data: cityData } = api.general.getCities.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when fetching the cities",
    },
  })

  /**
   * Instantiate the cities (Should only happen once)
   */
  useEffect(() => {
    setCities(cityData ?? [])
  }, [cityData, setCities])

  /**
   * This use effect runs a game loop every 0.5s to update the map object
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      const newMapObject = produce(cleanMapObject, (draftMapObject) => {
        npcs.forEach((npc) => {
          const {
            path: { createdAt, path },
            ship: { speed },
          } = npc

          const timePassed = Date.now() - createdAt.getMilliseconds()
          // Debugged by Yijiao He
          const tilesMoved = Math.floor(timePassed * speed)
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
    }, 500)
    return () => clearInterval(intervalId)
  })
}

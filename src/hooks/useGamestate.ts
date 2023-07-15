import { useCallback, useEffect } from "react"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

export const useGamestate = () => {
  const { setMap, setNpcs } = useGamestateStore(
    useCallback(
      (state) => ({ setMap: state.setMap, setNpcs: state.setNpcs }),
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
  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     npcs.forEach((npc) => {
  //       // TODO: a better way to do this?
  //       const mapClone = clone(map)
  //       const {
  //         start_time,
  //         path,
  //         ship_type: { speed },
  //       } = npc
  //       const timePassed = Date.now() - start_time
  //       const tilesMoves = Math.floor(timePassed / speed)
  //       const { x, y } = path[tilesMoves % path.length]
  //       const tile = mapClone[x][y]
  //       if (tile.npcs) {
  //         mapClone[x][y] = { ...tile, npcs: [...tile.npcs, npc] }
  //       } else {
  //         mapClone[x][y] = { ...tile, npcs: [npc] }
  //       }
  //       setInnerMap(mapClone)
  //     })
  //   }, 1000)
  //   return () => clearInterval(intervalId)
  // })

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
    setMap(mapData ?? [])
  }, [mapData, setMap])
}

import { produce } from "immer"
import { useCallback, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"
import {
  getNpcCurrentXYTileId,
  getTilesMoved,
  getXYFromXYTileId,
} from "~/utils/utils"

const VALID_KEYS = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "w",
  "a",
  "s",
  "d",
  "Escape",
  "z",
]

export const useGamestate = () => {
  const {
    setInitialMapState,
    setNpcs,
    setSailingShips,
    setCities,
    setMapObject,
    handleShipPath,
    cleanMapObject,
    npcs,
    sailingShips,
    selectedShip,
    selectedShipPathArray,
  } = useGamestateStore((state) => ({
    setInitialMapState: state.setInitialMapState,
    setMapObject: state.setMapObject,
    setCities: state.setCities,
    setSailingShips: state.setSailingShips,
    setNpcs: state.setNpcs,
    handleShipPath: state.handleShipPath,
    cleanMapObject: state.cleanMapObject,
    npcs: state.npcs,
    sailingShips: state.sailingShips,
    selectedShip: state.selectedShip,
    selectedShipPathArray: state.selectedShipPathArray,
  }))

  const { data: mapData } = api.map.getAllTiles.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when fetching the tiles",
    },
  })

  /**
   * Instantiate the map (Should only happen once)
   */
  useEffect(() => {
    setInitialMapState(mapData ?? [])
  }, [mapData, setInitialMapState])

  const { data: npcData } = api.map.getNpcs.useQuery(undefined, {
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

  const { data: cityData } = api.map.getCities.useQuery(undefined, {
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
        /**
         * Adding NPCs to the map object
         */
        npcs.forEach((npc) => {
          const {
            path: { createdAt, pathArray },
            speed,
          } = npc

          const npcXYTileId = getNpcCurrentXYTileId({
            createdAtTimeMs: createdAt?.getTime() ?? 0,
            currentTimeMs: Date.now(),
            speed,
            pathArray,
          })

          const currentTile = draftMapObject[npcXYTileId]

          if (!currentTile)
            throw new Error(
              `Tried to access a non-existent tile. Info: ${JSON.stringify(
                npc,
              )}`,
            )

          draftMapObject[npcXYTileId] = { ...currentTile, npc }
        })

        /**
         * Adding User Ships to the map object
         */
        sailingShips.forEach((ship) => {
          const {
            path: { createdAt, pathArray },
            speed,
          } = ship

          const tilesMoved = getTilesMoved({
            speed,
            currentTimeMs: Date.now(),
            createdAtTimeMs: createdAt?.getTime() ?? 0,
          })

          // If the ship has finished sailing, don't add it to the map object
          if (tilesMoved >= pathArray.length) {
            // Remove the ship from the ship list if it is finished sailing
            setSailingShips(
              sailingShips.filter((currentShip) => currentShip.id !== ship.id),
            )
            return
          }

          const pathKey = pathArray[tilesMoved]

          if (!pathKey)
            throw new Error(
              `Math is wrong when calculating pathKey. Info: ${JSON.stringify(
                ship,
              )}`,
            )
          const currentTile = draftMapObject[pathKey]
          if (!currentTile)
            throw new Error(
              `Tried to access a non-existent tile. Info: ${JSON.stringify(
                ship,
              )}`,
            )
          draftMapObject[pathKey] = { ...currentTile, ship }
        })
      })
      setMapObject(newMapObject)
    }, 500)
    return () => clearInterval(intervalId)
  }, [cleanMapObject, npcs, setMapObject, sailingShips, setSailingShips])

  const shipNavigationHandler = useCallback(
    (e: KeyboardEvent) => {
      e.preventDefault()

      const currentTile = selectedShipPathArray.at(-1)
      const { x, y } = getXYFromXYTileId(currentTile ?? "")

      if (!VALID_KEYS.includes(e.key)) {
        toast.error(
          "Use WASD or arrow keys to navigate the ship (or push ESC to cancel",
        )
      }

      if (["ArrowUp", "w"].includes(e.key)) {
        const northTileId = `${x}:${y - 1}`
        if (cleanMapObject.hasOwnProperty(northTileId)) {
          handleShipPath(northTileId)
        }
      }
      if (["ArrowLeft", "a"].includes(e.key)) {
        const westTileId = `${x - 1}:${y}`
        if (cleanMapObject.hasOwnProperty(westTileId)) {
          handleShipPath(westTileId)
        }
      }
      if (["ArrowDown", "s"].includes(e.key)) {
        const southTileId = `${x}:${y + 1}`
        if (cleanMapObject.hasOwnProperty(southTileId)) {
          handleShipPath(southTileId)
        }
      }
      if (["ArrowRight", "d"].includes(e.key)) {
        const eastTileId = `${x + 1}:${y}`
        if (cleanMapObject.hasOwnProperty(eastTileId)) {
          handleShipPath(eastTileId)
        }
      }

      // TODO: how to get cmd-z functional
      // If CMD or z is pressed, undo the last move
      if (e.key === "z" || e.ctrlKey || e.metaKey) {
        handleShipPath()
      }

      // If escape is pressed, cancel the ship path
      if (e.key === "Escape") {
        handleShipPath([])
      }
    },
    [cleanMapObject, handleShipPath, selectedShipPathArray],
  )

  /**
   * This use effect checks to see if we should be directing a ship!
   */
  useEffect(() => {
    if (selectedShip) {
      window.addEventListener("keyup", shipNavigationHandler)

      return () => {
        window.removeEventListener("keyup", shipNavigationHandler)
      }
    }
  }, [selectedShip, shipNavigationHandler])
}

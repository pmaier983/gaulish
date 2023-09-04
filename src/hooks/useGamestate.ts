import { useCallback, useEffect } from "react"
import { toast } from "react-hot-toast"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"
import { getXYFromXYTileId } from "~/utils/utils"

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

// TODO: is there a better way to manage syncing then with useEffects?
export const useGamestate = () => {
  const {
    setInitialMapState,
    setNpcs,
    setUserShips,
    setCities,
    calculateMapObject,
    calculateVisibleTilesObject,
    handleShipPath,
    cleanMapObject,
    selectedShip,
    selectedShipPathArray,
  } = useGamestateStore((state) => ({
    setInitialMapState: state.setInitialMapState,
    calculateMapObject: state.calculateMapObject,
    calculateVisibleTilesObject: state.calculateVisibleTilesObject,
    setCities: state.setCities,
    setNpcs: state.setNpcs,
    setUserShips: state.setUserShips,
    handleShipPath: state.handleShipPath,
    cleanMapObject: state.cleanMapObject,
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

  const { data: userShipData } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users loaded their ships",
    },
  })

  /**
   * Sync the user's current ships with the gamestate
   */
  useEffect(() => {
    setUserShips(userShipData ?? [])
  }, [userShipData, setUserShips])

  /**
   * This use effect runs a game loop every 0.5s to update the map object
   */
  useEffect(() => {
    const intervalId = setInterval(() => {
      calculateMapObject()
      calculateVisibleTilesObject()
    }, 500)
    return () => clearInterval(intervalId)
  }, [calculateMapObject, calculateVisibleTilesObject])

  // TODO: add command Z functionality
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

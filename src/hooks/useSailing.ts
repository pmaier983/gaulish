import { produce } from "immer"
import { useSailingChannel } from "~/hooks/useSailingChannel"

import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"
import { handleSailingEvents } from "~/utils/sailingUtils"
import { useAtom } from "jotai"
import { haveLogsUpdatedAtom } from "~/state/atoms"

export const useSailing = () => {
  const queryClient = api.useContext()
  const [, setHaveLogsUpdatedState] = useAtom(haveLogsUpdatedAtom)
  const {
    selectedShip,
    addSailingShips,
    toggleShipSelection,
    setKnownTilesObject,
  } = useGamestateStore((state) => ({
    selectedShip: state.selectedShip,
    addSailingShips: state.addSailingShips,
    toggleShipSelection: state.toggleShipSelection,
    setKnownTilesObject: state.setKnownTilesObject,
  }))

  const { publishSailingInfo } = useSailingChannel({
    onReceiveSailingInfo: (sailingInfo) => {
      const newShip = sailingInfo.data.ship

      addSailingShips([newShip])
    },
  })

  const setSailMutationReturn = api.ships.sail.useMutation({
    onSuccess: (data) => {
      // On Success Cancel the ship selection
      toggleShipSelection()

      // Load the ships sailing path into the gamestate
      publishSailingInfo(data)

      // handles all the updated to logs & such
      handleSailingEvents({
        data,
        queryClient,
        setHaveLogsUpdatedState,
        setKnownTilesObject,
      })

      // Always update the ship after sailing
      queryClient.ships.getUsersShips.setData(undefined, (oldUserShipList) => {
        const newUserShipList = produce(
          oldUserShipList,
          (draftUserShipList) => {
            if (!draftUserShipList) throw Error("Could not find user ship list")

            const shipToReplaceIndex = draftUserShipList?.findIndex(
              (ship) => ship.id === selectedShip?.id,
            )

            if (!shipToReplaceIndex)
              throw Error("Could not find ship to replace")

            draftUserShipList[shipToReplaceIndex] = data.ship
          },
        )
        console.log({ newUserShipList, oldUserShipList })
        return newUserShipList
      })

      // TODO: show something to the user to let them know the ship has sailed
    },
  })

  return setSailMutationReturn
}

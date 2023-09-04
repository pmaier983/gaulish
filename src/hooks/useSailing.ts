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
  const { selectedShip, cityObject, addSailingShips, toggleShipSelection } =
    useGamestateStore((state) => ({
      cityObject: state.cityObject,
      selectedShip: state.selectedShip,
      addSailingShips: state.addSailingShips,
      toggleShipSelection: state.toggleShipSelection,
    }))

  const { publishSailingInfo } = useSailingChannel({
    onReceiveSailingInfo: (sailingInfo) => {
      const newShip = sailingInfo.data.ship

      addSailingShips([
        {
          ...newShip,
          path: sailingInfo.data.path,
        },
      ])
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
      })

      // Always update a ship to its next possible location
      queryClient.ships.getUsersShips.setData(undefined, (oldUserShipList) => {
        const newUserShipList = produce(
          oldUserShipList,
          (draftUserShipList) => {
            draftUserShipList?.forEach((ship) => {
              if (ship.id === selectedShip?.id) {
                const finalTile = data.path.pathArray.at(-1)
                if (!finalTile)
                  throw new Error("No final tile in returned ship sailing path")
                const destinationCity = cityObject[finalTile]

                // There is a chance the destination is not a city and the ship has sunk!
                if (destinationCity) {
                  ship.cityId = destinationCity.id
                }
              }
            })
          },
        )
        return newUserShipList
      })

      // TODO: show something to the user to let them know the ship has sailed
    },
  })

  return setSailMutationReturn
}

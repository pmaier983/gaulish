import { produce } from "immer"
import { useSailingChannel } from "~/hooks/useSailingChannel"

import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

export const useSailing = () => {
  const queryClient = api.useContext()
  const { selectedShip, cityObject, addShips, toggleShipSelection } =
    useGamestateStore((state) => ({
      cityObject: state.cityObject,
      selectedShip: state.selectedShip,
      addShips: state.addShips,
      toggleShipSelection: state.toggleShipSelection,
    }))

  const { publishSailingInfo } = useSailingChannel({
    onReceiveSailingInfo: (sailingInfo) => {
      const newShip = sailingInfo.data.ship

      addShips([
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

      // When the ship successfully sails, update the cityId to its new location
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
                if (!destinationCity)
                  throw Error(
                    "The final tile in the sailing path was not a know city!",
                  )
                ship.cityId = destinationCity.id
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

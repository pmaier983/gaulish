import { produce } from "immer"
import { useCallback } from "react"
import { useSailingChannel } from "~/hooks/useSailingChannel"

import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

export const useSailing = () => {
  const queryClient = api.useContext()
  const { selectedShip, cityObject, toggleShipSelection } = useGamestateStore(
    useCallback(
      (state) => ({
        cityObject: state.cityObject,
        selectedShip: state.selectedShip,
        toggleShipSelection: state.toggleShipSelection,
      }),
      [],
    ),
  )

  const { publishSailingInfo } = useSailingChannel({
    onReceiveSailingInfo: () => {},
  })

  const setSailMutationReturn = api.general.sail.useMutation({
    onSuccess: (data) => {
      // When the ship successfully sails, update the cityId to its new location
      queryClient.general.getUsersShips.setData(
        undefined,
        (oldUserShipList) => {
          const newUserShipList = produce(
            oldUserShipList,
            (draftUserShipList) => {
              draftUserShipList?.forEach((ship) => {
                if (ship.id === selectedShip?.id) {
                  const finalTile = data.path.pathArray.at(-1)
                  if (!finalTile)
                    throw new Error(
                      "No final tile in returned ship sailing path",
                    )
                  const destinationCity = cityObject[finalTile]
                  if (!destinationCity)
                    throw Error("The final tile was not a know city!")
                  ship.cityId = destinationCity.id
                  publishSailingInfo(data)
                }
              })
            },
          )
          return newUserShipList
        },
      )
      // On Success Cancel the ship selection
      toggleShipSelection()
      // TODO: show something to the user to let them know the ship has sailed
    },
  })

  return setSailMutationReturn
}

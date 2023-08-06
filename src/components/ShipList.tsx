import { useCallback } from "react"
import { type Ship } from "schema"
import { SHIP_ID_TO_SHIP_TYPES, SHIP_TYPES } from "~/components/constants"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

export const ShipList = () => {
  const { data, isSuccess } = api.general.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users loaded their ships",
    },
  })
  const { mutate } = api.general.addShip.useMutation()

  // If the user has no ship, allow the to grab a plank
  if (data?.length === 0 && isSuccess) {
    return (
      <div className="flex-1">
        <button
          onClick={() => {
            mutate({ ship_type_id: SHIP_TYPES.PLANK })
          }}
        >
          Grab a Plank
        </button>
      </div>
    )
  }

  return (
    <ul className="flex-1">
      {data?.map((ship) => <ShipListItem {...ship} key={ship.id} />)}
    </ul>
  )
}

export const ShipListItem = (ship: Ship) => {
  const { toggleShipSelection, selectedShip } = useGamestateStore(
    useCallback(
      (state) => ({
        selectedShip: state.selectedShip,
        toggleShipSelection: state.toggleShipSelection,
      }),
      [],
    ),
  )

  const shipType = SHIP_ID_TO_SHIP_TYPES[ship.shipTypeId]

  const isSelectedShip = selectedShip?.id === ship.id

  return (
    <li className="grid grid-cols-5">
      <div>{shipType?.name}</div>
      <div>{ship.gold}</div>
      <div>
        {/* TODO: implement on hover breakdown */}
        {ship.stone + ship.wheat + ship.wood + ship.wool}
      </div>
      <button disabled={isSelectedShip}>Trade</button>
      <button onClick={void toggleShipSelection}>
        {isSelectedShip ? "Cancel" : "Sail"}
      </button>
    </li>
  )
}

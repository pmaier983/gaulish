import { useCallback } from "react"
import { type Ship } from "schema"
import { Icon } from "~/components/Icon"
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

  // TODO: Setup an actual table library (https://tanstack.com/table/v8/docs/examples/react/basic)
  return (
    <table className="flex-1">
      <tbody className="flex flex-col gap-1">
        <tr className="grid grid-cols-5 p-2">
          <th className="text-left">Ship</th>
          <th className="text-left">Gold</th>
          <th className="text-left">Cargo</th>
        </tr>
        {data?.map((ship) => <ShipListItem {...ship} key={ship.id} />)}
      </tbody>
    </table>
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
    <tr
      className={`grid grid-cols-5 p-2 ${isSelectedShip ? "bg-blue-400" : ""}`}
    >
      <td>{shipType?.name}</td>
      <td>{ship.gold}</td>
      <td>
        {/* TODO: implement on hover breakdown */}
        {ship.stone + ship.wheat + ship.wood + ship.wool}
      </td>
      <td>
        <button disabled={isSelectedShip} className="w-full">
          Trade
        </button>
      </td>
      <td>
        <button
          onClick={() => toggleShipSelection(ship)}
          className="flex w-full justify-center rounded border border-solid border-black"
        >
          <Icon id={isSelectedShip ? "x" : "arrowRight"} />
        </button>
      </td>
    </tr>
  )
}

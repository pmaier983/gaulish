import { produce } from "immer"
import { useCallback } from "react"
import { type Ship } from "schema"

import { Icon } from "~/components/Icon"
import { Tooltip } from "~/components/Tooltip"
import { SHIP_TYPES } from "~/components/constants"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

// TODO: why is this component constantly re-rendering?
export const ShipList = () => {
  const queryClient = api.useContext()

  const { data, isSuccess } = api.general.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users loaded their ships",
    },
  })

  const { mutate } = api.general.addShip.useMutation({
    onSuccess: async (data) => {
      // when a new ship is added, update the ship list cache & invalidate the leaderboard
      queryClient.general.getUsersShips.setData(undefined, (oldShipList) => {
        const newData = produce(oldShipList, (draftShipList) => {
          draftShipList?.push(data)
          return
        })
        return newData
      })
      await queryClient.general.getLeaderboard.invalidate()
    },
  })

  // If the user has no ship, allow the to grab a plank
  if (data?.length === 0 && isSuccess) {
    return (
      <div className="flex-1">
        <button
          onClick={() => {
            mutate({ ship_type: SHIP_TYPES.PLANK })
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
        <tr className="grid grid-cols-5 items-end p-2">
          <th className="text-left">Ship</th>
          <th className="flex flex-col items-start text-xs">
            <span className="underline underline-offset-4">Gold</span>
            <span>Cargo</span>
          </th>
          <th className="text-left">City</th>
        </tr>
        {data?.map((ship) => <ShipListItem {...ship} key={ship.id} />)}
      </tbody>
    </table>
  )
}

// TODO: rework this to actually fit and function all screen sizes
export const ShipListItem = (ship: Ship) => {
  const { selectedShip, cityObject, toggleShipSelection } = useGamestateStore(
    useCallback(
      (state) => ({
        selectedShip: state.selectedShip,
        cityObject: state.cityObject,
        toggleShipSelection: state.toggleShipSelection,
      }),
      [],
    ),
  )

  const isSelectedShip = selectedShip?.id === ship.id

  return (
    <tr
      className={`grid grid-cols-5 items-center p-2 ${
        isSelectedShip ? "bg-blue-400" : ""
      }`}
    >
      <td>{ship?.name}</td>
      <td className="flex flex-col items-start text-xs">
        <span className="underline underline-offset-4">{ship.gold}</span>
        {/* TODO: implement on hover breakdown */}
        <span>{ship.stone + ship.wheat + ship.wood + ship.wool}</span>
      </td>
      <Tooltip content={cityObject[ship.cityId]?.name}>
        <td className="whitespace-no-wrap overflow-hidden text-ellipsis">
          {cityObject[ship.cityId]?.name}
        </td>
      </Tooltip>
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

import { produce } from "immer"
import { type Ship } from "schema"

import { Icon } from "~/components/Icon"
import { Tooltip } from "~/components/Tooltip"
import { SHIP_TYPES } from "~/components/constants"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

import styles from "./shipList.module.css"

// TODO: why is this component constantly re-rendering?
export const ShipList = () => {
  const queryClient = api.useContext()

  const { data, isSuccess } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users loaded their ships",
    },
  })

  const { mutate } = api.ships.addShip.useMutation({
    onSuccess: async (data) => {
      // when a new ship is added, update the ship list cache & invalidate the leaderboard
      queryClient.ships.getUsersShips.setData(undefined, (oldShipList) => {
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
        <tr className={styles.tableWrapper}>
          <th className="text-left">Ship</th>
          <th className="text-left">City</th>
          <th className="flex flex-col items-start ">
            <span className="border-b-2 border-black">Gold</span>
            <span>Cargo</span>
          </th>
        </tr>
        {data?.map((ship) => <ShipListItem {...ship} key={ship.id} />)}
      </tbody>
    </table>
  )
}

// TODO: rework this to actually fit and function all screen sizes
export const ShipListItem = (ship: Ship) => {
  const { ships, selectedShip, cityObject, toggleShipSelection } =
    useGamestateStore((state) => ({
      ships: state.ships,
      selectedShip: state.selectedShip,
      cityObject: state.cityObject,
      toggleShipSelection: state.toggleShipSelection,
    }))

  const isSelectedShip = selectedShip?.id === ship.id

  const isSailing = ships.map((currentShip) => currentShip.id).includes(ship.id)

  const cityName = cityObject[ship.cityId]?.name

  return (
    <tr
      className={`${styles.tableWrapper} ${
        isSelectedShip ? "bg-blue-400" : ""
      }`}
    >
      <Tooltip content={ship?.name}>
        <td className="whitespace-no-wrap overflow-hidden text-ellipsis">
          {ship?.name}
        </td>
      </Tooltip>
      <Tooltip content={cityName}>
        <td className="whitespace-no-wrap overflow-hidden text-ellipsis">
          {isSailing ? "Sailing" : cityName}
        </td>
      </Tooltip>
      <td className="flex flex-col items-start ">
        <span className="border-b-2 border-black">{ship.gold}</span>
        {/* TODO: implement on hover breakdown */}
        <span>{ship.stone + ship.wheat + ship.wood + ship.wool}</span>
      </td>
      <td className="flex flex-col gap-2">
        <button
          disabled={isSelectedShip}
          className="flex w-full justify-center rounded outline outline-1"
        >
          Trade
        </button>
        <button
          onClick={() => toggleShipSelection(ship)}
          className="flex w-full justify-center rounded outline outline-1"
        >
          <Icon id={isSelectedShip ? "x" : "arrowRight"} />
        </button>
      </td>
    </tr>
  )
}

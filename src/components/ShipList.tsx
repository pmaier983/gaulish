import { produce } from "immer"
import { type Ship } from "schema"
import * as Dialog from "@radix-ui/react-dialog"

import { Icon } from "~/components/Icon"
import { Tooltip } from "~/components/Tooltip"
import { MAX_SHIP_NAME_LENGTH } from "~/components/constants"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

import styles from "./shipList.module.css"
import { TooltipEditText } from "~/components/TooltipTextEditor"
import { CityDialog } from "~/components/dialogs/CityDialog"

// TODO: why is this component constantly re-rendering?
export const ShipList = () => {
  const queryClient = api.useContext()

  const { data, isSuccess } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users loaded their ships",
    },
  })

  const { mutate } = api.ships.addFreeShip.useMutation({
    onSuccess: async (data) => {
      // when a new ship is added, update the ship list cache & invalidate the leaderboard
      queryClient.ships.getUsersShips.setData(undefined, (oldShipList) => {
        const newData = produce(oldShipList, (draftShipList) => {
          draftShipList?.push({ ...data, path: null })
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
            mutate()
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
  const queryClient = api.useContext()
  const { sailingShips, selectedShip, cityObject, toggleShipSelection } =
    useGamestateStore((state) => ({
      sailingShips: state.sailingShips,
      selectedShip: state.selectedShip,
      cityObject: state.cityObject,
      toggleShipSelection: state.toggleShipSelection,
    }))

  const { mutate } = api.ships.updateShipName.useMutation({
    onSuccess: (newShipData) => {
      // when the ship name is updated update the ship list!
      queryClient.ships.getUsersShips.setData(undefined, (oldShipList) => {
        const newData = oldShipList?.map((currentShip) => {
          if (currentShip.id === newShipData.shipId) {
            return { ...currentShip, name: newShipData.newName }
          }
          return currentShip
        })
        return newData
      })
    },
  })

  const isSelectedShip = selectedShip?.id === ship.id

  const isSailing = sailingShips
    .map((currentShip) => currentShip.id)
    .includes(ship.id)

  const cityName = cityObject[ship.cityId]?.name

  return (
    <tr
      className={`${styles.tableWrapper} ${
        isSelectedShip ? "bg-blue-400" : ""
      }`}
    >
      <Tooltip
        interactive
        content={
          <TooltipEditText
            text={ship.name}
            maxNewTextLength={MAX_SHIP_NAME_LENGTH}
            onSubmit={(newName) => {
              mutate({ shipId: ship.id, newName: newName })
            }}
          />
        }
      >
        <td className="whitespace-no-wrap overflow-hidden text-ellipsis">
          {ship.name}
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
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <button
              disabled={isSelectedShip}
              className="flex w-full justify-center rounded outline outline-1"
            >
              Trade
            </button>
          </Dialog.Trigger>
          <CityDialog />
        </Dialog.Root>
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

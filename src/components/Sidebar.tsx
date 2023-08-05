import { useCallback } from "react"
import { SHIP_ID_TO_SHIP_TYPES, SHIP_TYPES } from "~/components/constants"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

interface SidebarProps {
  className?: string
  isDisabled: boolean
}

export const Sidebar = ({ className = "" }: SidebarProps) => {
  const { toggleShipSelection, selectedShip } = useGamestateStore(
    useCallback(
      (state) => ({
        selectedShip: state.selectedShip,
        toggleShipSelection: state.toggleShipSelection,
      }),
      [],
    ),
  )

  const { data, isSuccess } = api.general.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users loaded their ships",
    },
  })

  const { mutate } = api.general.addShip.useMutation()

  return (
    <div className={`flex flex-1 flex-col items-start ${className}`}>
      {data?.length === 0 && !!isSuccess && (
        <button
          onClick={() => {
            mutate({ ship_type_id: SHIP_TYPES.PLANK })
          }}
        >
          Grab a Plank
        </button>
      )}
      {data?.map((ship) => (
        <button
          key={ship.id}
          className={selectedShip?.id === ship.id ? "bg-red-500" : ""}
          onClick={() => {
            toggleShipSelection(ship)
          }}
        >
          {SHIP_ID_TO_SHIP_TYPES[ship.shipTypeId]?.name}
        </button>
      ))}
    </div>
  )
}

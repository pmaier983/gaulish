import { type ComponentPropsWithRef } from "react"
import { ImageIcon } from "~/components/ImageIcon"
import { Tooltip } from "~/components/Tooltip"
import { TooltipShipNameEditor } from "~/components/TooltipShipNameEditor"
import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"

interface ShipHeaderProps extends ComponentPropsWithRef<"div"> {
  shipId: string
}

export const ShipHeader = ({ shipId, className }: ShipHeaderProps) => {
  const queryClient = api.useContext()

  const { sailingShips, cityObject } = useGamestateStore((state) => ({
    sailingShips: state.sailingShips,
    cityObject: state.cityObject,
  }))

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users loaded their ships",
    },
    initialData: () =>
      // We are already fetching a list of all the cities, lets re-use that data!
      // Avoid no data "loading state" as it should in theory never happen
      queryClient.ships.getUsersShips.getData() ?? [],
  })

  const isSailing = sailingShips
    .map((currentShip) => currentShip.id)
    .includes(shipId)

  const ship = ships?.find((ship) => ship.id === shipId)

  // TODO: implement a better loading state here
  if (!ship) return null

  const city = cityObject[ship?.cityId]

  return (
    <div className={`flex flex-row items-center ${className}`}>
      <ImageIcon id={ship.shipType} />
      <div className="flex flex-col overflow-hidden whitespace-nowrap pl-2">
        <Tooltip
          interactive
          content={<TooltipShipNameEditor text={ship.name} shipId={ship.id} />}
        >
          {/* TODO: what proper html tag to use for prominence within articles? h4 or what */}
          <span className="h-5 overflow-hidden text-ellipsis text-xl leading-5">
            {ship.name}
          </span>
        </Tooltip>
        <div className="h-5 overflow-hidden text-ellipsis leading-5">
          {isSailing ? "Sailing" : city?.name ?? "Loading..."}
        </div>
      </div>
    </div>
  )
}

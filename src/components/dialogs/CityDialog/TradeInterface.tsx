import { type Ship } from "schema"
import { CityTradeCard } from "~/components/CityTradeCard"
import { ShipCard } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"
import { api } from "~/utils/api"

export interface TradeInterfaceProps extends BaseInterfaceProps {
  tradeShip?: Ship
}

export const TradeInterface = ({
  tradeShip,
  selectedCity,
}: TradeInterfaceProps) => {
  const queryClient = api.useContext()

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: () =>
      // We are already fetching a list of all the cities, lets re-use that data!
      // Avoid no data "loading state" as it should in theory never happen
      queryClient.ships.getUsersShips.getData() ?? [],
  })

  const visibleShips = ships.filter((ship) => {
    if (!selectedCity) return true
    return ship.cityId === selectedCity.id
  })

  // TODO: handle ship selection case
  if (!tradeShip)
    return (
      <div className="flex h-fit max-w-full flex-1 flex-row gap-2 overflow-x-auto p-2">
        <div className="flex min-w-[320px] flex-1 flex-col items-center gap-2 rounded-md p-2 outline outline-1 outline-black">
          {/* TODO: why is the bottom of this list squished (when it overflows?) */}
          {visibleShips.map((ship) => (
            <ShipCard key={ship.id} type="TINY" ship={ship} />
          ))}
        </div>
        <CityTradeCard />
      </div>
    )

  return (
    <article className="flex max-w-full flex-1 gap-2 p-2">
      <ShipHeader shipId={tradeShip.id} />
      <CityTradeCard />
    </article>
  )
}

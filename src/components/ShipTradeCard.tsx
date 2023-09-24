import { type ComponentPropsWithRef } from "react"
import { type Ship, type City } from "schema"
import { ShipCard } from "~/components/ShipCard"
import { api } from "~/utils/api"

interface ShipTradeCardProps extends ComponentPropsWithRef<"div"> {
  selectedCity?: City
  tradeShip?: Ship
}

export const ShipTradeCard = ({
  tradeShip,
  selectedCity,
  className,
}: ShipTradeCardProps) => {
  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: [],
  })

  const visibleShips = ships.filter((ship) => {
    if (!selectedCity) return true
    return ship.cityId === selectedCity.id
  })

  if (!tradeShip) {
    return (
      <div
        className={`flex min-w-[320px] flex-1 flex-col items-center gap-2 rounded-md p-2 ${className}`}
      >
        <div className="text-2xl">Select a Ship</div>
        {/* TODO: why is the bottom of this list squished (when it overflows?) */}
        {visibleShips.map((ship) => (
          <ShipCard key={ship.id} type="TINY" ship={ship} />
        ))}
      </div>
    )
  }

  return <div className="flex flex-1">TODO</div>
}

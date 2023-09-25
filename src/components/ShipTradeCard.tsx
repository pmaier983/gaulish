import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { ShipCard } from "~/components/ShipCard"
import { type ShipComposite } from "~/state/gamestateStore"
import { api } from "~/utils/api"

interface ShipTradeCardProps extends ComponentPropsWithRef<"div"> {
  selectedCity?: City
  tradeShip?: ShipComposite
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

  // If there is no trade ship, render a trade ship selection interface
  if (!tradeShip) {
    return (
      <div
        className={`flex min-w-[320px] flex-1 flex-col items-center gap-2 rounded-md ${className}`}
      >
        {visibleShips.map((ship) => (
          <ShipCard key={ship.id} type="TINY" ship={ship} />
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 justify-center">
      <ShipCard type="LARGE" ship={tradeShip} />
    </div>
  )
}

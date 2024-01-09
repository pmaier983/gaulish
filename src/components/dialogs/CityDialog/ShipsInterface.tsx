import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { ShipCard } from "~/components/ShipCard"
import { api } from "~/utils/api"

export interface ShipsInterfaceProps extends ComponentPropsWithRef<"div"> {
  selectedCity?: City
}

export const ShipsInterface = ({
  selectedCity,
  className,
}: ShipsInterfaceProps) => {
  const queryClient = api.useUtils()

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: () =>
      // We are already fetching a list of all the cities, lets re-use that data!
      // Avoid no data "loading state" as it should in theory never happen
      queryClient.ships.getUsersShips.getData() ?? [],
  })

  return (
    <div
      className={`flex max-w-full flex-1 gap-2 overflow-x-auto p-2 ${className}`}
    >
      {ships
        .filter((ship) => {
          if (!selectedCity) return true
          return ship.cityId === selectedCity.id
        })
        .map((ship) => (
          <ShipCard key={ship.id} ship={ship} type="LARGE" />
        ))}
    </div>
  )
}

import { ShipCard } from "~/components/ShipCard"
import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"
import { api } from "~/utils/api"

export interface ShipsInterfaceProps extends BaseInterfaceProps {}

export const ShipsInterface = ({}: ShipsInterfaceProps) => {
  const queryClient = api.useContext()

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: () =>
      // We are already fetching a list of all the cities, lets re-use that data!
      // Avoid no data "loading state" as it should in theory never happen
      queryClient.ships.getUsersShips.getData() ?? [],
  })

  return (
    <div className="flex flex-1 gap-2 overflow-visible overflow-x-auto p-2">
      {ships.map((ship) => (
        <ShipCard key={ship.id} ship={ship} />
      ))}
    </div>
  )
}

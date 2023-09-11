import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"
import { api } from "~/utils/api"

export interface ShipsInterfaceProps extends BaseInterfaceProps {}

export const ShipsInterface = ({
  setCityDialogInterface,
}: ShipsInterfaceProps) => {
  const queryClient = api.useContext()

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: () =>
      // We are already fetching a list of all the cities, lets re-use that data!
      // Avoid no data "loading state" as it should in theory never happen
      queryClient.ships.getUsersShips.getData() ?? [],
  })

  return (
    <div>
      {ships.map((ship) => {
        return <div key={ship.id}>{ship.name}</div>
      })}
    </div>
  )
}

import { SHIP_ID_TO_SHIP_TYPES, SHIP_TYPES } from "~/components/constants"
import { api } from "~/utils/api"

export const Sidebar = () => {
  const { data, isSuccess } = api.general.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    meta: {
      errorMessage: "Something went wrong when the users ships",
    },
  })
  const { mutate } = api.general.addShip.useMutation()
  return (
    <div className="flex-1">
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
        <div key={ship.id}>{SHIP_ID_TO_SHIP_TYPES[ship.shipTypeId]?.name}</div>
      ))}
    </div>
  )
}

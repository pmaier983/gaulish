import { api } from "~/utils/api"

// TODO: handle cities next!
export const Sidebar = () => {
  const { data, isSuccess } = api.general.getUsersShips.useQuery()
  const { mutate } = api.general.addShip.useMutation({})
  return (
    <div className="flex-1">
      {data?.length === 0 && isSuccess && (
        <button
          onClick={() => {
            // mutate({city_id: 1, })
          }}
        ></button>
      )}
    </div>
  )
}

import { produce } from "immer"

import { ShipCard } from "~/components/ShipCard"
import { api } from "~/utils/api"

// TODO: why is this component constantly re-rendering?
export const ShipList = () => {
  const queryClient = api.useContext()

  const { data: ships, isSuccess } = api.ships.getUsersShips.useQuery(
    undefined,
    {
      staleTime: Infinity,
      meta: {
        errorMessage: "Something went wrong when the users loaded their ships",
      },
    },
  )

  const { mutate } = api.ships.addFreeShip.useMutation({
    onSuccess: async (data) => {
      // when a new ship is added, update the ship list cache & invalidate the leaderboard
      queryClient.ships.getUsersShips.setData(undefined, (oldShipList) => {
        const newData = produce(oldShipList, (draftShipList) => {
          draftShipList?.push(data)
        })
        return newData
      })
      await queryClient.general.getLeaderboard.invalidate()
    },
  })

  // If the user has no ship, allow the to grab a plank
  if (ships?.length === 0 && isSuccess) {
    return (
      <div className="flex-1">
        <button
          onClick={() => {
            mutate()
          }}
        >
          Grab a Plank
        </button>
      </div>
    )
  }

  return (
    // TODO: why is this scroll cutting off the bottom element?
    <div className="flex flex-1 flex-col items-center gap-3 p-2">
      {ships?.map((ship) => (
        <ShipCard key={ship.id} ship={ship} type="SMALL" />
      ))}
    </div>
  )
}

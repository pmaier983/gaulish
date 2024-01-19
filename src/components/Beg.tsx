import { api } from "~/utils/api"

export const Beg = () => {
  const queryClient = api.useUtils()

  const { mutate: beg } = api.general.beg.useMutation({
    onSuccess: () => {
      // invalidate ships query to refetch
      queryClient.ships.invalidate()
    },
  })

  return (
    <div className="p-8">
      <button onClick={() => beg()} className="border-2 bg-red-400 p-4">
        Beg
      </button>
    </div>
  )
}

import { useChannel, usePresence } from "@ably-labs/react-hooks"
import { useSession } from "next-auth/react"
import { CHANNELS } from "~/components/constants"
import { ABLY_CLIENT_ID } from "~/utils/utils"

export const Leaderboard = () => {
  const { data } = useSession()
  const [members] = usePresence(CHANNELS.MESSAGE, {
    ...data?.user,
    clientId: ABLY_CLIENT_ID,
  })

  return (
    <div className="flex-1">
      {members.map((member) => (
        <div key={member.clientId}>{member?.data?.name}</div>
      ))}
    </div>
  )
}

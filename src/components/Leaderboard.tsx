import { usePresence } from "@ably-labs/react-hooks"
import { type Session } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { memo, useEffect } from "react"

import { CHANNELS } from "~/components/constants"
import { api } from "~/utils/api"
import { ABLY_CLIENT_ID } from "~/utils/utils"

// TODO: possibly look into why this component is re-rending constantly?
export const Leaderboard = () => {
  const { data } = useSession()

  const [members, updatePresence] = usePresence(CHANNELS.MESSAGE, {
    ...data?.user,
    clientId: ABLY_CLIENT_ID,
  })

  // Seems I need to force update my presence for some reason?
  useEffect(() => {
    updatePresence({
      ...data?.user,
      clientId: ABLY_CLIENT_ID,
    })
  }, [data?.user, updatePresence])

  return (
    <div className="flex-1">
      <LeaderboardList
        emails={members.map((member) => member.data.email).filter(Boolean)}
      />
    </div>
  )
}

// TODO: should I be using ID's and not emails here?
const LeaderboardList = ({ emails }: { emails: string[] }) => {
  const { data } = api.general.getLeaderboard.useQuery(emails, {
    enabled: emails.length > 0,
  })
  return (
    <div>
      {data?.map((user) => (
        <div key={user.username}>
          {user.username}-{user.gold}
        </div>
      ))}
    </div>
  )
}

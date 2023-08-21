import { usePresence } from "@ably-labs/react-hooks"
import { useSession } from "next-auth/react"
import { useEffect } from "react"

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
  const { data } = api.general.getLeaderboard.useQuery(emails.slice(0, 10), {
    enabled: emails.length > 0,
    staleTime: 20000, // only refresh the leaderboard every 20s
    meta: {
      errorMessage: "Something went wrong while fetching the leaderboard",
    },
  })
  return (
    <ol
      className="flex h-full list-decimal flex-col items-center justify-start  overflow-y-auto"
      type="1"
    >
      {data
        ?.sort((a, b) => a.gold - b.gold)
        .map((user, i) => (
          <li
            key={user.username}
            className="flex w-full justify-between pl-5 pr-5"
          >
            <div>
              {i + 1}
              {")"}
            </div>
            <h3>{user.username}</h3>
            <div>{user.gold}</div>
          </li>
        ))}
    </ol>
  )
}

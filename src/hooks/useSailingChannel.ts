import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { type Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback } from "react"

import { type Path, type Ship } from "schema"
import { CHANNELS } from "~/components/constants"

export interface SailingInfoData {
  ship: Ship
  path: Path
  user: Session["user"]
}

export interface SailingInfo extends Omit<Types.Message, "data"> {
  data: SailingInfoData
}

interface useSailingProps {
  onReceiveSailingInfo: (sailingInfo: SailingInfo) => void
}

export const useSailingChannel = ({
  onReceiveSailingInfo,
}: useSailingProps) => {
  const { data } = useSession()

  const [channel] = useChannel(CHANNELS.SAILING, (sailingInfo: SailingInfo) => {
    console.log("SET SAIL!", sailingInfo)
    onReceiveSailingInfo(sailingInfo)
  })

  const publishSailingInfo = useCallback(
    (sailingInfo: Omit<SailingInfoData, "user">) => {
      channel.publish({
        data: { ...sailingInfo, user: data?.user },
      })
    },
    [channel, data?.user],
  )

  return { publishSailingInfo }
}

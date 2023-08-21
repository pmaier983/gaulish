import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { type Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback } from "react"
import { CHANNELS } from "~/components/constants"

export interface MessageData {
  text: string
  user: Session["user"]
}

export interface Message extends Omit<Types.Message, "data"> {
  data: MessageData
}

interface UseChatMessageProps {
  onReceiveChatMessage: (message: Message) => void
}

export const useMessageChannel = ({
  onReceiveChatMessage,
}: UseChatMessageProps) => {
  const { data } = useSession()

  const [channel] = useChannel(CHANNELS.MESSAGE, (message: Message) => {
    console.log("MESSAGE", message)
    onReceiveChatMessage(message)
  })

  const publishChatMessage = useCallback(
    (chatMessage: Omit<MessageData, "user">) => {
      channel.publish({
        data: { ...chatMessage, user: data?.user },
      })
    },
    [channel, data?.user],
  )

  return { publishChatMessage }
}

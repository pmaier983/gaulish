import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { type Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback } from "react"

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

export const useChatMessage = ({
  onReceiveChatMessage,
}: UseChatMessageProps) => {
  const { data } = useSession()
  const [channel] = useChannel("message", (message: Message) => {
    console.log(message)
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

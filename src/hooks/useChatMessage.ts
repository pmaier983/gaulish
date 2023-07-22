import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { type Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect } from "react"
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

export const useChatMessage = ({
  onReceiveChatMessage,
}: UseChatMessageProps) => {
  const { data } = useSession()
  const [channel] = useChannel(CHANNELS.MESSAGE, (message: Message) => {
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

  // TODO: handle presence errors better
  useEffect(() => {
    channel.presence.enter(data?.user, (err) => {
      if (err) {
        return console.error("Error entering presence set.")
      }
      console.log("This client has entered the presence set.")
    })
    return () => {
      channel.presence.leave(data?.user, (err) => {
        if (err) {
          return console.error("Error exiting presence set.")
        }
        console.log("This client has exited the presence set.")
      })
    }
  }, [channel.presence, data?.user])

  return { publishChatMessage }
}

import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { type Session } from "next-auth"
import { useSession } from "next-auth/react"
import { useState } from "react"

export interface MessageData {
  text: string
  user: Session["user"]
}

export interface Message extends Omit<Types.Message, "data"> {
  data: MessageData
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatText, setChatText] = useState("")
  const { data } = useSession()

  // TODO: abstract this to its own hook & handle presence & types
  const [channel] = useChannel("message", (message: Message) => {
    console.log(message)
    setMessages((currentMessages) => [...currentMessages, message])
  })

  const onSubmit = () => {
    // TODO: figure out a way to always require this type?
    channel.publish({
      channel,
      data: { text: chatText, user: data?.user } as MessageData,
    })
  }

  return (
    <div className="flex-1 self-end">
      {/* <button
        onClick={() => {
          channel.presence.enter()
        }}
      >
        Enter presence
      </button>
      <button
        onClick={() => {
          channel.presence.get((err, members) => {
            console.log(members)
          })
        }}
      >
        check presence?
      </button> */}
      {messages.map((message) => (
        <div key={message.id}>{message.data.text}</div>
      ))}
      <form
        className="flex justify-center gap-2 p-2"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <textarea
          className="h-6 w-4/5"
          value={chatText}
          onChange={(e) => {
            setChatText(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              onSubmit()
            }
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

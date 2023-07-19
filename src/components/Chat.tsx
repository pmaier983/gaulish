import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { type FormEvent, useState } from "react"

export const Chat = () => {
  const [messages, setMessages] = useState<Types.Message[]>([])
  const [chatMessage, setChatMessage] = useState("")

  const [channel] = useChannel("message", (message) => {
    setMessages((currentMessages) => [...currentMessages, message])
  })

  const onSubmit = (formEvent?: FormEvent<HTMLFormElement>) => {
    // prevent full page reload
    formEvent?.preventDefault()
    channel.publish({ data: chatMessage })
  }

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.data}</div>
      ))}
      <form onSubmit={onSubmit}>
        <textarea
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={(e) => {
            e.preventDefault()
            if (e.key === "Enter" && !e.shiftKey) {
              onSubmit()
            }
          }}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

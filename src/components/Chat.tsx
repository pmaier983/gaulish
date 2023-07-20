import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { useState } from "react"

export const Chat = () => {
  const [messages, setMessages] = useState<Types.Message[]>([])
  const [chatMessage, setChatMessage] = useState("")

  const [channel] = useChannel("message", (message) => {
    console.log(message)
    setMessages((currentMessages) => [...currentMessages, message])
  })

  const onSubmit = () => {
    channel.publish({ data: chatMessage })
  }

  return (
    <div className="flex-1 self-end">
      {messages.map((message) => (
        <div key={message.id}>{message.data}</div>
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
          value={chatMessage}
          onChange={(e) => {
            setChatMessage(e.target.value)
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

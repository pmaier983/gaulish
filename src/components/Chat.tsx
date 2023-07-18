import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably"
import { useState } from "react"

export const Chat = () => {
  const [messages, setMessages] = useState<Types.Message[]>([])

  const [channel, ably] = useChannel("message", (message) => {
    setMessages((currentMessages) => [...currentMessages, message])
  })

  const onSubmit = (formData: string) => {
    console.log(formData)
    channel.publish({ data: formData })
  }

  return (
    <div>
      {messages.map((message) => (
        <div key={message.id}>{message.data}</div>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit("why")
        }}
      >
        <textarea />
        <input type="submit" />
      </form>
    </div>
  )
}

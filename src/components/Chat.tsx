import { useState } from "react"
import { type Message, useMessageChannel } from "~/hooks/useMessageChannel"

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatText, setChatText] = useState("")

  const onReceiveChatMessage = (message: Message) => {
    setMessages((receivedMessages) => [...receivedMessages, message])
  }

  const { publishChatMessage } = useMessageChannel({ onReceiveChatMessage })

  const onSubmit = () => {
    publishChatMessage({ text: chatText })
  }

  return (
    <div className="flex-1 self-end">
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

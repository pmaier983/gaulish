import { useState } from "react"
import { type Message, useMessageChannel } from "~/hooks/useMessageChannel"

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [chatText, setChatText] = useState("")

  const onReceiveChatMessage = (message: Message) => {
    setMessages((receivedMessages) => [message, ...receivedMessages])
  }

  const { publishChatMessage } = useMessageChannel({ onReceiveChatMessage })

  const onSubmit = () => {
    publishChatMessage({ text: chatText })
  }

  return (
    <div className="flex flex-1 flex-col justify-between gap-3 overflow-y-auto p-3 ">
      <div className="flex flex-1 flex-col-reverse overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id}>{message.data.text}</div>
        ))}
      </div>
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
      >
        <textarea
          className="h-8 flex-1"
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

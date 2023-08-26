import { useState } from "react"
import { Chat } from "~/components/Chat"
import { LineLog } from "~/components/LineLog"

const FOOTER_TYPES = {
  CHAT: "CHAT",
  LOG: "LOG",
} as const

export type FooterType = keyof typeof FOOTER_TYPES

export const Footer = () => {
  const [footerType, setFooterType] = useState<FooterType>(FOOTER_TYPES.CHAT)

  return (
    <div className="flex h-full flex-1 flex-col">
      {/* TODO: should this have any special a11y tags going on? */}
      <div className="flex gap-2">
        <button
          onClick={() => {
            setFooterType(FOOTER_TYPES.CHAT)
          }}
        >
          Chat
        </button>
        <button
          onClick={() => {
            setFooterType(FOOTER_TYPES.LOG)
          }}
        >
          Log
        </button>
      </div>
      <FooterContent footerType={footerType} />
    </div>
  )
}

const FooterContent = ({
  footerType,
  ...props
}: {
  footerType: FooterType
}) => {
  switch (footerType) {
    case FOOTER_TYPES.CHAT: {
      return <Chat {...props} />
    }
    case FOOTER_TYPES.LOG: {
      return <LineLog {...props} />
    }
    default: {
      console.error(
        `You passed in an invalid Footer Type: ${JSON.stringify(footerType)}`,
      )
      return <Chat />
    }
  }
}

import { useAtom } from "jotai"
import { useState } from "react"
import { Chat } from "~/components/Chat"
import { LineLog } from "~/components/LineLog"
import { haveLogsUpdatedAtom } from "~/state/atoms"

const FOOTER_TYPES = {
  CHAT: "CHAT",
  LOG: "LOG",
} as const

export type FooterType = keyof typeof FOOTER_TYPES

export const Footer = () => {
  const [haveLogsUpdated] = useAtom(haveLogsUpdatedAtom)

  const [footerType, setFooterType] = useState<FooterType>(FOOTER_TYPES.CHAT)

  return (
    <div className="flex h-full flex-1 flex-col p-3">
      {/* TODO: should this have any special a11y tags going on? */}
      <div className="flex gap-2">
        <button
          className={`flex justify-center rounded p-1 outline outline-1 ${
            footerType === FOOTER_TYPES.CHAT && "bg-blue-400 font-bold"
          }`}
          onClick={() => {
            setFooterType(FOOTER_TYPES.CHAT)
          }}
        >
          Chat
        </button>
        <button
          className={`flex justify-center rounded p-1 outline outline-1 ${
            footerType === FOOTER_TYPES.LOG && "bg-blue-400 font-bold"
          } ${haveLogsUpdated && "outline-4 outline-red-600"}`}
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

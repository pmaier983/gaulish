import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FullPageRedirect } from "~/components/FullPageRedirect"
import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably/promises"

const MapCreation = dynamic(() => import("~/components/MapCreation"), {
  ssr: false,
})

const Dev = () => {
  const { data } = useSession()
  const [isDevMapCreationVisible, setDevMapCreationVisibility] = useState(false)
  const [channel] = useChannel("some-channel-name", (message: Types.Message) =>
    console.log("Received Ably message", message),
  )

  if (data?.user.email !== "pmaier983@gmail.com") {
    return <FullPageRedirect />
  }

  return (
    <>
      <button
        onClick={() => {
          channel.publish({ name: "chat-message", data: "hi" })
        }}
      >
        Test Socket
      </button>
      <button
        onClick={() => {
          setDevMapCreationVisibility(!isDevMapCreationVisible)
        }}
      >
        {isDevMapCreationVisible
          ? "Hide Dev Map Creation"
          : "Show Dev Map Creation"}
      </button>
      {isDevMapCreationVisible ? <MapCreation /> : null}
    </>
  )
}

// page export
// eslint-disable-next-line import/no-default-export
export default Dev

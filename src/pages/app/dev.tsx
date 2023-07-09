import dynamic from "next/dynamic"
import { useState } from "react"
import { FullPageRedirect } from "~/components/FullPageRedirect"
import { useChannel } from "@ably-labs/react-hooks"
import { type Types } from "ably/promises"
import { api } from "~/utils/api"

const MapCreation = dynamic(() => import("~/components/MapCreation"), {
  ssr: false,
})

const Dev = () => {
  const [isDevMapCreationVisible, setDevMapCreationVisibility] = useState(false)
  const [channel] = useChannel("some-channel-name", (message: Types.Message) =>
    console.log("Received Ably message", message),
  )

  const { data: isUserAdmin } = api.general.isUserAdmin.useQuery()

  if (!isUserAdmin) {
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

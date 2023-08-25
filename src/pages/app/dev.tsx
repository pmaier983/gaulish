import dynamic from "next/dynamic"
import { useState } from "react"
import { useSession } from "next-auth/react"

import { FullPageRedirect } from "~/components/FullPageRedirect"
import { useGlobalStore } from "~/state/globalStore"
import { api } from "~/utils/api"
import { ImageGeneration } from "~/components/ImageGeneration"

const MapCreation = dynamic(() => import("~/components/MapCreation"), {
  ssr: false,
})

const Dev = () => {
  const { data } = useSession()
  const { isUserAdmin } = useGlobalStore((state) => ({
    isUserAdmin: state.isUserAdmin,
  }))
  const [isDevMapCreationVisible, setDevMapCreationVisibility] = useState(false)
  const { mutate } = api.general.setupDefaultGamestate.useMutation()

  if (!isUserAdmin) {
    return <FullPageRedirect />
  }

  return (
    <>
      <button
        className="pt-8"
        onClick={() => {
          mutate()
        }}
      >
        Setup Default Gamestate
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
      <div>{JSON.stringify(data)}</div>
      <ImageGeneration />
      {isDevMapCreationVisible ? <MapCreation /> : null}
    </>
  )
}

// page export
// eslint-disable-next-line import/no-default-export
export default Dev

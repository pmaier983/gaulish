import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { useState } from "react"
import { FullPageRedirect } from "~/components/FullPageRedirect"

const MapCreation = dynamic(() => import("~/components/pixi/MapCreation"), {
  ssr: false,
})

const Dev = () => {
  const { data } = useSession()
  const [isDevMapCreationVisible, setDevMapCreationVisibility] = useState(false)

  if (data?.user.email !== "pmaier983@gmail.com") {
    return <FullPageRedirect />
  }

  return (
    <>
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

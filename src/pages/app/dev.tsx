import { useSession } from "next-auth/react"
import dynamic from "next/dynamic"
import { FullPageRedirect } from "~/components/FullPageRedirect"

const MapCreation = dynamic(() => import("~/components/pixi/MapCreation"), {
  ssr: false,
})

const Dev = () => {
  const { data } = useSession()

  if (data?.user.email !== "pmaier983@gmail.com") {
    return <FullPageRedirect />
  }

  return (
    <>
      <MapCreation />
    </>
  )
}

// page export
// eslint-disable-next-line import/no-default-export
export default Dev

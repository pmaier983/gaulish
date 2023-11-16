import dynamic from "next/dynamic"
import { DevNavBar } from "~/components/dev/DevNavBar"

import { FullPageRedirect } from "~/components/FullPageRedirect"
import { useGlobalStore } from "~/state/globalStore"

const MapCreation = dynamic(() => import("~/components/map/MapCreation"), {
  ssr: false,
})

const MapCreationPage = () => {
  const { isUserAdmin } = useGlobalStore((state) => ({
    isUserAdmin: state.isUserAdmin,
  }))

  // TODO: how to handle this with middleware?
  if (!isUserAdmin) {
    return <FullPageRedirect />
  }

  return (
    <>
      <DevNavBar />
      <MapCreation />
    </>
  )
}

// page export
// eslint-disable-next-line import/no-default-export
export default MapCreationPage

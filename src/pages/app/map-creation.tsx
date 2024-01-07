import dynamic from "next/dynamic"

import { DevNavBar } from "~/components/dev/DevNavBar"

const MapCreation = dynamic(() => import("~/components/map/MapCreation"), {
  ssr: false,
})

const MapCreationPage = () => (
  <>
    <DevNavBar />
    <MapCreation />
  </>
)

// page export
// eslint-disable-next-line import/no-default-export
export default MapCreationPage

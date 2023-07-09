import dynamic from "next/dynamic"

import { useElementSize } from "~/hooks/useElementSize"

import styles from "./index.module.css"
import { api } from "~/utils/api"
import { useSession } from "next-auth/react"

const Map = dynamic(() => import("~/components/Map"), {
  ssr: false,
})

const App = () => {
  const a = useSession()
  const { sizeRef, size } = useElementSize()

  // console.log(a)

  /* 
    To populate the map we need the following:
    - all tiles
    - all enemy routes
    - all cities
  */
  // TODO: consider moving this to a zustand state?
  const { data } = api.general.getAllTiles.useQuery()

  return (
    <div className={styles.container}>
      <div className={styles.header}>Details</div>
      <div className={styles.sidebar}>Sidebar</div>
      <div className={styles.main} ref={sizeRef}>
        <Map mapWidth={size.width} mapHeight={size.height} map={data} />
      </div>
      <div className={styles.footer}>Chat & Log</div>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App

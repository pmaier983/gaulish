import dynamic from "next/dynamic"

import { useElementSize } from "~/hooks/useElementSize"

import styles from "./index.module.css"
import { api } from "~/utils/api"

const Map = dynamic(() => import("~/components/Map"), {
  ssr: false,
})

const App = () => {
  const { sizeRef, size } = useElementSize()

  /* 
    To populate the map we need the following:
    - all tiles
    - all enemy routes
    - all cities
  */
  const { data } = api.general.getAllTiles.useQuery(undefined, {
    staleTime: Infinity,
  })

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

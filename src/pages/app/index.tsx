import dynamic from "next/dynamic"

import { useElementSize } from "~/hooks/useElementSize"

import styles from "./index.module.css"
import { useGamestate } from "~/hooks/useGamestate"
import { useGamestateStore } from "~/state/gamestateStore"
import { useCallback } from "react"
import { Chat } from "~/components/Chat"
import { Leaderboard } from "~/components/Leaderboard"
import { Sidebar } from "~/components/Sidebar"

const Map = dynamic(() => import("~/components/Map"), {
  ssr: false,
})

const App = () => {
  const { sizeRef, size } = useElementSize()
  const { mapArray } = useGamestateStore(
    useCallback((state) => ({ mapArray: state.mapArray }), []),
  )

  useGamestate()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Leaderboard />
      </div>
      <div className={styles.sidebar}>
        <Sidebar />
      </div>
      <div className={styles.main} ref={sizeRef}>
        <Map
          mapWidth={size.width}
          mapHeight={size.height}
          mapArray={mapArray}
        />
      </div>
      <div className={styles.footer}>
        <Chat />
      </div>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App

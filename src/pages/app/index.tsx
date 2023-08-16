import dynamic from "next/dynamic"

import { useElementSize } from "~/hooks/useElementSize"

import styles from "./index.module.css"
import { useGamestate } from "~/hooks/useGamestate"
import { useGamestateStore } from "~/state/gamestateStore"
import { useCallback, useEffect } from "react"
import { Chat } from "~/components/Chat"
import { Leaderboard } from "~/components/Leaderboard"
import { Sidebar } from "~/components/Sidebar"
import { useGlobalStore } from "~/state/globalStore"
import { ProfilePicture } from "~/components/ProfilePicture"
import { MapFooter } from "~/components/MapFooter"

const Map = dynamic(() => import("~/components/Map"), {
  ssr: false,
})

const App = () => {
  const { sizeRef, size } = useElementSize()
  const { mapArray, selectedShip } = useGamestateStore(
    useCallback(
      (state) => ({
        mapArray: state.mapArray,
        selectedShip: state.selectedShip,
      }),
      [],
    ),
  )
  const {
    isLeaderboardDisabled,
    isSidebarDisabled,
    isChatDisabled,
    isMapDisabled,
  } = useGlobalStore(
    useCallback(
      (state) => ({
        isLeaderboardDisabled: state.isLeaderboardDisabled,
        isSidebarDisabled: state.isSidebarDisabled,
        isChatDisabled: state.isChatDisabled,
        isMapDisabled: state.isMapDisabled,
      }),
      [],
    ),
  )

  useGamestate()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {isLeaderboardDisabled && <div className={styles.isDisabledOverlay} />}
        <Leaderboard />
      </div>
      <div className={styles.sidebar}>
        {isSidebarDisabled && <div className={styles.isDisabledOverlay} />}
        <Sidebar />
      </div>
      <div className={styles.main} ref={sizeRef}>
        {isMapDisabled && <div className={styles.isDisabledOverlay} />}
        <MapFooter />
        <ProfilePicture className="absolute right-0 h-20 w-20 pr-4 pt-4" />
        <Map
          mapWidth={size.width}
          mapHeight={size.height}
          mapArray={mapArray}
          className={selectedShip ? "border-8 border-red-500" : ""}
        />
      </div>
      <div className={styles.footer}>
        {isChatDisabled && <div className={styles.isDisabledOverlay} />}
        <Chat />
      </div>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App

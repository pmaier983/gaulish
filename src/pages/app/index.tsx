import dynamic from "next/dynamic"
import * as Dialog from "@radix-ui/react-dialog"

import { useElementSize } from "~/hooks/useElementSize"

import styles from "./index.module.css"
import { useGamestate } from "~/hooks/useGamestate"
import { useGamestateStore } from "~/state/gamestateStore"
import { Leaderboard } from "~/components/Leaderboard"
import { Sidebar } from "~/components/Sidebar"
import { useGlobalStore } from "~/state/globalStore"
import { ProfilePicture } from "~/components/ProfilePicture"
import { MapFooter } from "~/components/MapFooter"
import { DevNavBar } from "~/components/dev/DevNavBar"
import { Footer } from "~/components/Footer"
import { CityDialog } from "~/components/dialogs/CityDialog"
import { useCityDialogStore } from "~/state/cityDialogStore"
import { MapPixiTile } from "~/components/MapPixiTile"

const MapWrapper = dynamic(() => import("~/components/MapWrapper"), {
  ssr: false,
})

const App = () => {
  const { sizeRef, size } = useElementSize()
  const { mapArray, selectedShip } = useGamestateStore((state) => ({
    mapArray: state.mapArray,
    selectedShip: state.selectedShip,
  }))
  const {
    isLeaderboardDisabled,
    isSidebarDisabled,
    isChatDisabled,
    isMapDisabled,
  } = useGlobalStore((state) => ({
    isLeaderboardDisabled: state.isLeaderboardDisabled,
    isSidebarDisabled: state.isSidebarDisabled,
    isChatDisabled: state.isChatDisabled,
    isMapDisabled: state.isMapDisabled,
  }))

  const { isOpen, toggleOpenState } = useCityDialogStore((state) => ({
    isOpen: state.isOpen,
    toggleOpenState: state.toggleOpenState,
  }))

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
        <DevNavBar />
        <ProfilePicture className="absolute right-0 h-20 w-20 pr-4 pt-4" />
        <MapWrapper
          mapWidth={size.width}
          mapHeight={size.height}
          mapArray={mapArray}
          className={selectedShip ? "border-8 border-red-500" : ""}
        >
          {mapArray?.map((tile) => (
            <MapPixiTile key={tile.xyTileId} {...tile} />
          ))}
        </MapWrapper>
      </div>
      <div className={styles.footer}>
        {isChatDisabled && <div className={styles.isDisabledOverlay} />}
        <Footer />
      </div>
      <Dialog.Root open={isOpen} onOpenChange={toggleOpenState}>
        <CityDialog />
      </Dialog.Root>
    </div>
  )
}

// Need to export this for next to pick it up properly
// eslint-disable-next-line import/no-default-export
export default App

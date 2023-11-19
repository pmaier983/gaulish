import * as Dialog from "@radix-ui/react-dialog"
import dynamic from "next/dynamic"

import styles from "./index.module.css"
import { useGamestate } from "~/hooks/useGamestate"
import { Leaderboard } from "~/components/Leaderboard"
import { Sidebar } from "~/components/Sidebar"
import { useGlobalStore } from "~/state/globalStore"
import { Footer } from "~/components/Footer"
import { CityDialog } from "~/components/dialogs/CityDialog"
import { useCityDialogStore } from "~/state/cityDialogStore"

export const GameMap = dynamic(
  () =>
    import("~/components/map/GameMap").then(
      (allExports) => allExports.GameMap_DO_NOT_USE_DIRECTLY,
    ),
  {
    ssr: false,
  },
)

const App = () => {
  const { isLeaderboardDisabled, isSidebarDisabled, isChatDisabled } =
    useGlobalStore((state) => ({
      isLeaderboardDisabled: state.isLeaderboardDisabled,
      isSidebarDisabled: state.isSidebarDisabled,
      isChatDisabled: state.isChatDisabled,
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
      <GameMap className={styles.main} />
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

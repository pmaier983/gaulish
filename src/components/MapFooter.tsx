import { useCallback } from "react"
import { useGamestateStore } from "~/state/gamestateStore"

import styles from "./mapFooter.module.css"

interface MapFooterProps {
  className?: string
}

export const MapFooter = ({ className = "" }: MapFooterProps) => {
  const { selectedShip, toggleShipSelection } = useGamestateStore(
    useCallback(
      (state) => ({
        selectedShip: state.selectedShip,
        toggleShipSelection: state.toggleShipSelection,
      }),
      [],
    ),
  )

  if (!selectedShip) return null

  return (
    <div className={`${className} ${styles.footerContainer ?? ""}`}>
      <button
        className={styles.cancelButton}
        onClick={void toggleShipSelection}
      >
        Cancel
      </button>
      <div className={styles.gap} />
      <button
        className={styles.sailButton}
        onClick={() => {
          console.log(selectedShip)
        }}
      >
        Sail
      </button>
    </div>
  )
}

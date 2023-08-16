import React, { useCallback } from "react"
import { useGamestateStore } from "~/state/gamestateStore"

import styles from "./mapFooter.module.css"

interface MapFooterProps {
  className?: string
}

export const MapFooter = ({ className = "" }: MapFooterProps) => {
  const {
    selectedShip,
    cityObject,
    selectedShipPathArray,
    toggleShipSelection,
  } = useGamestateStore(
    useCallback(
      (state) => ({
        cityObject: state.cityObject,
        selectedShipPathArray: state.selectedShipPathArray,
        selectedShip: state.selectedShip,
        toggleShipSelection: state.toggleShipSelection,
      }),
      [],
    ),
  )

  if (!selectedShip) return null

  const isShipSailingToKnownCity =
    selectedShipPathArray.length > 1 &&
    cityObject.hasOwnProperty(selectedShipPathArray.at(-1) ?? "")

  return (
    <div className={`${className} ${styles.footerContainer ?? ""}`}>
      <button
        className={styles.cancelButton}
        onClick={() => toggleShipSelection()}
      >
        Cancel
      </button>
      <div className={styles.gap} />
      <button
        className={`${styles.sailButton ?? ""} ${
          isShipSailingToKnownCity ? styles.sailButtonPure ?? "" : ""
        }`}
        onClick={() => {
          console.log(selectedShip)
        }}
        disabled={selectedShipPathArray.length === 1}
      >
        Sail
      </button>
    </div>
  )
}

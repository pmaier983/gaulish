import React from "react"

import { useGamestateStore } from "~/state/gamestateStore"
import styles from "./mapFooter.module.css"
import { useSailing } from "~/hooks/useSailing"

interface MapFooterProps {
  className?: string
}

export const MapFooter = ({ className = "" }: MapFooterProps) => {
  const {
    selectedShip,
    cityObject,
    selectedShipPathArray,
    toggleShipSelection,
  } = useGamestateStore((state) => ({
    cityObject: state.cityObject,
    selectedShipPathArray: state.selectedShipPathArray,
    selectedShip: state.selectedShip,
    toggleShipSelection: state.toggleShipSelection,
  }))

  const { mutate: setSail, isLoading } = useSailing()

  if (!selectedShip) return null

  const isShipSailingToKnownCity =
    selectedShipPathArray.length > 1 &&
    cityObject.hasOwnProperty(selectedShipPathArray.at(-1) ?? "")

  return (
    <div className={`${className} ${styles.footerContainer ?? ""}`}>
      <button
        className={styles.cancelButton}
        onClick={() => toggleShipSelection()}
        disabled={isLoading}
      >
        Cancel
      </button>
      <div className={styles.gap} />
      <button
        className={`${styles.sailButton ?? ""} ${
          isShipSailingToKnownCity ? styles.sailButtonPure ?? "" : ""
        }`}
        onClick={() => {
          // TODO: open a warning modal If the user is sailing to an unknown location!
          setSail({ path: selectedShipPathArray, shipId: selectedShip.id })
        }}
        disabled={selectedShipPathArray.length === 1 || isLoading}
      >
        {/* TODO: improve this warning screen! */}
        {isLoading ? "Loading" : "Sail"}
      </button>
    </div>
  )
}

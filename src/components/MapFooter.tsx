import React, { useCallback } from "react"
import { produce } from "immer"

import { useGamestateStore } from "~/state/gamestateStore"
import { api } from "~/utils/api"
import styles from "./mapFooter.module.css"

interface MapFooterProps {
  className?: string
}

export const MapFooter = ({ className = "" }: MapFooterProps) => {
  const queryClient = api.useContext()
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
  const { mutate: setSail, isLoading } = api.general.sail.useMutation({
    onSuccess: (data) => {
      // When the ship successfully sails, update the cityId to its new location
      queryClient.general.getUsersShips.setData(
        undefined,
        (oldUserShipList) => {
          const newUserShipList = produce(
            oldUserShipList,
            (draftUserShipList) => {
              draftUserShipList?.forEach((ship) => {
                if (ship.id === selectedShip?.id) {
                  ship.cityId = data.destinationCity.id
                }
              })
            },
          )
          return newUserShipList
        },
      )
      // On Success Cancel the ship selection
      toggleShipSelection()
      // TODO: show something to the user to let them know the ship has sailed
    },
  })

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

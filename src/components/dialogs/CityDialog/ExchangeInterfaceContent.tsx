import { produce } from "immer"
import React, { useState, type ComponentPropsWithRef } from "react"
import { type CargoTypes } from "schema"

import { FormatNumberChange } from "~/components/FormatNumberChange"
import { CargoCount } from "~/components/ImageIconCount"
import { CARGO_TYPES_LIST } from "~/components/constants"
import { ExchangeInterfaceRow } from "~/components/dialogs/CityDialog/ExchangeInterfaceRow"
import { type ShipComposite } from "~/state/gamestateStore"
import { api } from "~/utils/api"
import { addToLogs } from "~/utils/sailingUtils"

interface ExchangeInterfaceContentProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShipLeft: ShipComposite
  selectedExchangeShipRight: ShipComposite
}

type ShipsExchangeState = {
  [key in CargoTypes]: number
}

export const ExchangeInterfaceContent = ({
  selectedExchangeShipLeft,
  selectedExchangeShipRight,
  className = "",
}: ExchangeInterfaceContentProps) => {
  const queryClient = api.useContext()

  const { mutate: exchange } = api.trade.exchangeCargo.useMutation({
    onMutate: (exchangeInputs) => {
      queryClient.ships.getUsersShips.setData(undefined, (oldShips) => {
        const newShips = produce(oldShips, (draftShips) => {
          const leftShipToUpdate = draftShips?.find(
            (ship) => ship.id === exchangeInputs.leftShipId,
          )
          const rightShipToUpdate = draftShips?.find(
            (ship) => ship.id === exchangeInputs.rightShipId,
          )
          if (!leftShipToUpdate?.cargo) throw new Error("Ship has no cargo")
          if (!rightShipToUpdate?.cargo) throw new Error("Ship has no cargo")

          leftShipToUpdate.cargo = {
            ...leftShipToUpdate.cargo,
            ...exchangeInputs.newLeftShipCargo,
          }

          rightShipToUpdate.cargo = {
            ...rightShipToUpdate.cargo,
            ...exchangeInputs.newRightShipCargo,
          }

          return draftShips
        })

        return newShips
      })
    },
    onError: () => {
      // If things fail, refresh everything to be safe!
      void queryClient.ships.getUsersShips.invalidate()
    },
    onSuccess: ({ newLogs }) => {
      // when the query succeeds, update the logs!
      addToLogs({ queryClient, newLogs })
    },
  })

  // Create a list of all the cargo that either ship has that is greater than 0
  // Exclude gold from this list
  const cargoList = [
    ...Object.entries(selectedExchangeShipLeft.cargo),
    ...Object.entries(selectedExchangeShipRight.cargo),
  ]
    .filter(([key, value]) => {
      if (typeof value !== "number") return false
      if (key === "gold") return false
      return value > 0
    })
    .map(([key]) => key as CargoTypes)
    .sort((a, b) => a.length - b.length)

  const initialGoldState = selectedExchangeShipRight.cargo.gold

  const [currentGoldState, setGoldState] = useState(initialGoldState)

  const initialExchangeState = CARGO_TYPES_LIST.reduce<ShipsExchangeState>(
    (acc, cargoType) => {
      const rightShipCargoCount = selectedExchangeShipRight.cargo[cargoType]

      acc[cargoType] = rightShipCargoCount

      return acc
    },
    {} as ShipsExchangeState,
  )

  const [currentExchangeState, setExchangeState] =
    useState<ShipsExchangeState>(initialExchangeState)

  const leftShipInitialCargoCount = cargoList.reduce((acc, cargoType) => {
    return acc + selectedExchangeShipLeft.cargo[cargoType]
  }, 0)
  const leftShipCargoCount = Object.entries(currentExchangeState).reduce(
    (acc, [key, value]) => {
      const sum =
        selectedExchangeShipLeft.cargo[key as CargoTypes] +
        selectedExchangeShipRight.cargo[key as CargoTypes]
      return acc + sum - value
    },
    0,
  )
  const leftCargoChange = leftShipCargoCount - leftShipInitialCargoCount
  const newLeftShipCargo = {
    ...CARGO_TYPES_LIST.reduce<ShipsExchangeState>((acc, cargoType) => {
      const cargoSum =
        selectedExchangeShipRight.cargo[cargoType] +
        selectedExchangeShipLeft.cargo[cargoType]

      acc[cargoType] = cargoSum - currentExchangeState[cargoType]

      return acc
    }, {} as ShipsExchangeState),
    gold:
      selectedExchangeShipRight.cargo.gold +
      selectedExchangeShipLeft.cargo.gold -
      currentGoldState,
  }

  const rightShipInitialCargoCount = cargoList.reduce((acc, cargoType) => {
    return acc + selectedExchangeShipRight.cargo[cargoType]
  }, 0)
  const rightShipCargoCount = Object.entries(currentExchangeState).reduce(
    (acc, [, value]) => acc + value,
    0,
  )
  const rightCargoChange = rightShipCargoCount - rightShipInitialCargoCount
  const newRightShipCargo = {
    ...currentExchangeState,
    gold: currentGoldState,
  }

  const exchangeErrorText = (() => {
    // Check if the exchange & gold states have not changed from their initial values
    if (
      JSON.stringify(currentExchangeState) ===
        JSON.stringify(initialExchangeState) &&
      currentGoldState === initialGoldState
    ) {
      return "Nothing to Exchange"
    }
    if (
      leftShipCargoCount > selectedExchangeShipLeft.cargoCapacity ||
      rightShipCargoCount > selectedExchangeShipRight.cargoCapacity
    ) {
      return "Cargo Capacity Exceeded"
    }

    return false
  })()

  const isExchangeEnabled = !!exchangeErrorText

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      <ExchangeInterfaceRow
        icon="GOLD"
        value={currentGoldState}
        leftValue={selectedExchangeShipLeft.cargo.gold}
        rightValue={selectedExchangeShipRight.cargo.gold}
        onValueChange={(newGoldState) => setGoldState(newGoldState)}
      />
      {cargoList.map((cargoType) => (
        <React.Fragment key={cargoType}>
          <div className="border-t-2 border-dashed border-black" />
          <ExchangeInterfaceRow
            icon={cargoType}
            value={currentExchangeState[cargoType]}
            leftValue={selectedExchangeShipLeft.cargo[cargoType]}
            rightValue={selectedExchangeShipRight.cargo[cargoType]}
            onValueChange={(value) => {
              setExchangeState({
                ...currentExchangeState,
                [cargoType]: value,
              })
            }}
          />
        </React.Fragment>
      ))}
      <div className="flex flex-row gap-4 self-center">
        <CargoCount
          cargoCapacity={selectedExchangeShipLeft.cargoCapacity}
          currentCargo={leftShipCargoCount}
        />
        <div className="flex flex-row items-center gap-2 rounded pl-2 pr-2 outline outline-2 outline-black">
          <FormatNumberChange
            valueChange={leftCargoChange}
            className="w-8 text-center"
          />
          <button
            className="z-10 h-full bg-green-400 p-2 outline outline-2 outline-black hover:bg-green-700 hover:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:outline-slate-500"
            onClick={() => {
              exchange({
                leftShipId: selectedExchangeShipLeft.id,
                rightShipId: selectedExchangeShipRight.id,
                newRightShipCargo,
                newLeftShipCargo,
              })
            }}
            disabled={isExchangeEnabled}
          >
            Exchange
          </button>
          <FormatNumberChange
            valueChange={rightCargoChange}
            className="w-8 text-center"
          />
        </div>
        <CargoCount
          cargoCapacity={selectedExchangeShipRight.cargoCapacity}
          currentCargo={rightShipCargoCount}
          className="flex-row-reverse"
        />
      </div>
      {exchangeErrorText && (
        <div className="flex self-center text-red-600">{exchangeErrorText}</div>
      )}
    </div>
  )
}

import React, { useState, type ComponentPropsWithRef } from "react"
import { type CargoTypes } from "schema"
import { FormatNumberChange } from "~/components/FormatNumberChange"
import { CargoCount } from "~/components/ImageIconCount"
import { CARGO_TYPES_LIST } from "~/components/constants"
import { ExchangeInterfaceRow } from "~/components/dialogs/CityDialog/ExchangeInterfaceRow"
import { type ShipComposite } from "~/state/gamestateStore"

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

  const [currentGoldState, setGoldState] = useState(
    Math.min(
      selectedExchangeShipLeft.cargo.gold,
      selectedExchangeShipRight.cargo.gold,
    ),
  )
  const [currentExchangeState, setExchangeState] = useState<ShipsExchangeState>(
    CARGO_TYPES_LIST.reduce<ShipsExchangeState>((acc, cargoType) => {
      const rightShipCargoCount = selectedExchangeShipRight.cargo[cargoType]

      acc[cargoType] = rightShipCargoCount

      return acc
    }, {} as ShipsExchangeState),
  )

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

  const rightShipInitialCargoCount = cargoList.reduce((acc, cargoType) => {
    return acc + selectedExchangeShipRight.cargo[cargoType]
  }, 0)
  const rightShipCargoCount = Object.entries(currentExchangeState).reduce(
    (acc, [, value]) => acc + value,
    0,
  )
  const rightCargoChange = rightShipCargoCount - rightShipInitialCargoCount

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
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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
          <button className="h-full border-l-2 border-r-2 border-black p-2">
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
    </div>
  )
}

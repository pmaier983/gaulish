import React, { useState, type ComponentPropsWithRef } from "react"
import { type CargoTypes } from "schema"
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
    </div>
  )
}

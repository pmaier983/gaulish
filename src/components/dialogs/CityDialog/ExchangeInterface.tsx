import { type ComponentPropsWithRef } from "react"
import { type CargoTypes, type City } from "schema"
import { SwapButton } from "~/components/Button/SwapButton"
import { ShipHeader } from "~/components/ShipHeader"
import { ShipSelector } from "~/components/ShipSelector"
import { ExchangeInterfaceRow } from "~/components/dialogs/CityDialog/ExchangeInterfaceRow"
import {
  type CityDialogStoreActions,
  useCityDialogStore,
} from "~/state/cityDialogStore"
import { type ShipComposite } from "~/state/gamestateStore"
import { api } from "~/utils/api"

export interface ExchangeInterfaceProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShipLeft?: ShipComposite
  selectedExchangeShipRight?: ShipComposite
  selectedCity?: City
}

export const ExchangeInterface = ({
  selectedExchangeShipLeft,
  selectedExchangeShipRight,
  selectedCity,
  className,
}: ExchangeInterfaceProps) => {
  const { shipExchangeClick } = useCityDialogStore((state) => ({
    shipExchangeClick: state.shipExchangeClick,
  }))

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: [],
  })

  const visibleShips = ships.filter((ship) => {
    if (selectedExchangeShipLeft) {
      if (selectedExchangeShipLeft.id === ship.id) return false
      return ship.cityId === selectedExchangeShipLeft.cityId
    }
    if (selectedExchangeShipRight) {
      if (selectedExchangeShipRight.id === ship.id) return false
      return ship.cityId === selectedExchangeShipRight.cityId
    }
    if (!selectedCity) return true
    return ship.cityId === selectedCity.id
  })

  if (!selectedExchangeShipLeft || !selectedExchangeShipRight) {
    return (
      <div
        className={`flex h-min max-w-full flex-1 flex-col gap-2 overflow-x-auto p-2 ${className}`}
      >
        <ExchangeInterfaceHeader
          selectedExchangeShipLeft={selectedExchangeShipLeft}
          selectedExchangeShipRight={selectedExchangeShipRight}
          shipExchangeClick={shipExchangeClick}
        />
        {/* Interface Selection Content */}
        <div className="grid flex-1 grid-cols-2 gap-5">
          <ShipSelector
            side="LEFT"
            selectedShip={selectedExchangeShipLeft}
            ships={visibleShips}
            onSelection={(ship) => {
              shipExchangeClick({
                newExchangeShipId: selectedExchangeShipLeft
                  ? undefined
                  : ship.id,
                side: "LEFT",
              })
            }}
            onSelectionCancel={() => {
              shipExchangeClick({
                newExchangeShipId: undefined,
                side: "LEFT",
              })
            }}
          />
          <ShipSelector
            side="RIGHT"
            selectedShip={selectedExchangeShipRight}
            ships={visibleShips}
            onSelection={(ship) => {
              shipExchangeClick({
                newExchangeShipId: selectedExchangeShipRight
                  ? undefined
                  : ship.id,
                side: "RIGHT",
              })
            }}
            onSelectionCancel={() => {
              shipExchangeClick({
                newExchangeShipId: undefined,
                side: "RIGHT",
              })
            }}
            className="flex-row-reverse"
          />
        </div>
      </div>
    )
  }

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

  return (
    <div
      className={`flex h-min max-w-full flex-1 flex-col gap-2 overflow-x-auto p-2 ${className}`}
    >
      <ExchangeInterfaceHeader
        selectedExchangeShipLeft={selectedExchangeShipLeft}
        selectedExchangeShipRight={selectedExchangeShipRight}
        shipExchangeClick={shipExchangeClick}
      />
      {/* Interface Content */}
      <div className="flex flex-col">
        <ExchangeInterfaceRow icon="GOLD" />
        {cargoList.map((cargoType) => (
          <ExchangeInterfaceRow key={cargoType} icon={cargoType} />
        ))}
      </div>
    </div>
  )
}

interface ExchangeInterfaceHeaderProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShipLeft?: ShipComposite
  selectedExchangeShipRight?: ShipComposite
  shipExchangeClick: CityDialogStoreActions["shipExchangeClick"]
}

const ExchangeInterfaceHeader = ({
  selectedExchangeShipLeft,
  selectedExchangeShipRight,
  shipExchangeClick,
}: ExchangeInterfaceHeaderProps) => {
  return (
    <div className="grid flex-1 grid-cols-[1fr_2px_1fr] gap-3 border-b-2 border-black">
      <div className="flex flex-row items-center justify-between gap-2 pb-2">
        {selectedExchangeShipLeft ? (
          <div className="flex flex-row gap-2">
            <ShipHeader shipId={selectedExchangeShipLeft?.id} />
            <SwapButton
              onClick={() => {
                shipExchangeClick({
                  newExchangeShipId: undefined,
                  side: "LEFT",
                })
              }}
            />
          </div>
        ) : (
          <div className="text-2xl">Select a Ship</div>
        )}
      </div>
      <div className="h-full bg-black" />
      <div className="flex flex-row-reverse items-center justify-between gap-2 pb-2">
        {selectedExchangeShipRight ? (
          <div className="flex flex-row-reverse">
            <ShipHeader
              shipId={selectedExchangeShipRight.id}
              className="flex-row-reverse gap-3"
            />
            <SwapButton
              onClick={() => {
                shipExchangeClick({
                  newExchangeShipId: undefined,
                  side: "RIGHT",
                })
              }}
            />
          </div>
        ) : (
          <div className="text-2xl">Select a Ship</div>
        )}
      </div>
    </div>
  )
}

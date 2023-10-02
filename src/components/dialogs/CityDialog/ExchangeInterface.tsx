import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { ShipCargoCount } from "~/components/ImageIconCount"
import { ShipCard } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { ShipSelector } from "~/components/ShipSelector"
import { useCityDialogStore } from "~/state/cityDialogStore"
import { type ShipComposite } from "~/state/gamestateStore"

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

  if (!selectedExchangeShipLeft || !selectedExchangeShipRight) {
    return (
      <div
        className={`flex h-min max-w-full flex-1 flex-col gap-2 overflow-x-auto p-2 ${className}`}
      >
        <ExchangeInterfaceHeader
          selectedExchangeShipLeft={selectedExchangeShipLeft}
          selectedExchangeShipRight={selectedExchangeShipRight}
        />
        {/* Interface Selection Content */}
        <div className="grid flex-1 grid-cols-2 gap-5">
          <div>
            {selectedExchangeShipLeft ? (
              <ShipCard ship={selectedExchangeShipLeft} type="LARGE" />
            ) : (
              <ShipSelector
                side="LEFT"
                selectedShip={selectedExchangeShipLeft}
                selectedCity={selectedCity}
                onSelection={(ship) => {
                  shipExchangeClick({
                    newExchangeShipId: ship.id,
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
            )}
          </div>
          <div>
            {selectedExchangeShipRight ? (
              <ShipCard ship={selectedExchangeShipRight} type="LARGE" />
            ) : (
              <ShipSelector
                side="RIGHT"
                selectedShip={selectedExchangeShipRight}
                selectedCity={selectedCity}
                onSelection={(ship) => {
                  shipExchangeClick({
                    newExchangeShipId: ship.id,
                    side: "RIGHT",
                  })
                }}
                onSelectionCancel={() => {
                  shipExchangeClick({
                    newExchangeShipId: undefined,
                    side: "RIGHT",
                  })
                }}
              />
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex h-min max-w-full flex-1 flex-col gap-2 overflow-x-auto p-2 ${className}`}
    >
      <ExchangeInterfaceHeader
        selectedExchangeShipLeft={selectedExchangeShipLeft}
        selectedExchangeShipRight={selectedExchangeShipRight}
      />
      {/* Interface Content */}
      <div>TODO Content</div>
    </div>
  )
}

interface ExchangeInterfaceHeaderProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShipLeft?: ShipComposite
  selectedExchangeShipRight?: ShipComposite
}

const ExchangeInterfaceHeader = ({
  selectedExchangeShipLeft,
  selectedExchangeShipRight,
}: ExchangeInterfaceHeaderProps) => {
  return (
    <div className="grid flex-1 grid-cols-[1fr_2px_1fr] gap-3 border-b-2 border-black">
      <div className="flex flex-row items-center justify-between gap-2 pb-2">
        {selectedExchangeShipLeft ? (
          <>
            <ShipHeader shipId={selectedExchangeShipLeft?.id} />
            <ShipCargoCount ship={selectedExchangeShipLeft} />
          </>
        ) : (
          <>
            <div className="text-2xl">Select a Ship</div>
            <div />
          </>
        )}
      </div>
      <div className="h-full bg-black" />
      <div className="flex flex-row items-center justify-between gap-2 pb-2">
        {selectedExchangeShipRight ? (
          <>
            <ShipCargoCount
              ship={selectedExchangeShipRight}
              className="flex-row-reverse"
            />
            <ShipHeader shipId={selectedExchangeShipRight.id} />
          </>
        ) : (
          <>
            <div />
            <div className="text-2xl">Select a Ship</div>
          </>
        )}
      </div>
    </div>
  )
}

import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { type ShipComposite } from "~/state/gamestateStore"

export interface ExchangeInterfaceProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShipLeft?: ShipComposite
  selectedExchangeShipRight?: ShipComposite
  selectedCity?: City
}

export const ExchangeInterface = ({
  selectedExchangeShipLeft,
  selectedExchangeShipRight,
  className,
}: ExchangeInterfaceProps) => {
  if (!selectedExchangeShipLeft || !selectedExchangeShipRight) {
    return <div></div>
  }

  return (
    <div
      className={`flex max-w-full flex-1 gap-2 overflow-x-auto p-2 ${className}`}
    >
      <ExchangeInterfaceHeader
        selectedExchangeShipLeft={selectedExchangeShipLeft}
        selectedExchangeShipRight={selectedExchangeShipRight}
      />
    </div>
  )
}

interface ExchangeInterfaceHeaderProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShipLeft?: ShipComposite
  selectedExchangeShipRight?: ShipComposite
}

const ExchangeInterfaceHeader = ({} // selectedExchangeShipLeft,
// selectedExchangeShipRight,
: ExchangeInterfaceHeaderProps) => {
  return <div className="grid flex-1 grid-cols-2"></div>
}

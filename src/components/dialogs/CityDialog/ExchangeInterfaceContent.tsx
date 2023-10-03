import { type ComponentPropsWithRef } from "react"
import { type CargoTypes } from "schema"
import { ExchangeInterfaceRow } from "~/components/dialogs/CityDialog/ExchangeInterfaceRow"
import { type ShipComposite } from "~/state/gamestateStore"

interface ExchangeInterfaceContentProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShipLeft: ShipComposite
  selectedExchangeShipRight: ShipComposite
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

  return (
    <div className={`flex w-full flex-col gap-3 ${className}`}>
      <ExchangeInterfaceRow icon="GOLD" />
      {cargoList.map((cargoType) => (
        <ExchangeInterfaceRow key={cargoType} icon={cargoType} />
      ))}
    </div>
  )
}

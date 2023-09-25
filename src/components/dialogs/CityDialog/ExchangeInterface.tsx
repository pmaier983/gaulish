import { type ComponentPropsWithRef } from "react"
import { type ShipComposite } from "~/state/gamestateStore"

export interface ExchangeInterfaceProps extends ComponentPropsWithRef<"div"> {
  selectedExchangeShips?: ShipComposite[]
}

export const ExchangeInterface = ({ className }: ExchangeInterfaceProps) => {
  return (
    <div
      className={`flex max-w-full flex-1 gap-2 overflow-x-auto p-2 ${className}`}
    >
      Exchange
    </div>
  )
}

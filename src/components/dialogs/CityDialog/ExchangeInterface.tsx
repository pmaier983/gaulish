import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"
import { type ShipComposite } from "~/state/gamestateStore"

export interface ExchangeInterfaceProps extends BaseInterfaceProps {
  selectedExchangeShips: ShipComposite[]
}

export const ExchangeInterface = ({}: ExchangeInterfaceProps) => {
  return (
    <div className="flex max-w-full flex-1 gap-2 overflow-x-auto p-2">
      Exchange
    </div>
  )
}

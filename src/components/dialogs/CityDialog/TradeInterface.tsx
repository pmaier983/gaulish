import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"

export interface TradeInterfaceProps extends BaseInterfaceProps {}

export const TradeInterface = ({}: TradeInterfaceProps) => {
  return <div className="flex flex-1 gap-2 overflow-x-auto p-2">Trade</div>
}

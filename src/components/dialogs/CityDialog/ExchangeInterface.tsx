import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"

export interface ExchangeInterfaceProps extends BaseInterfaceProps {}

export const ExchangeInterface = ({}: ExchangeInterfaceProps) => {
  return <div className="flex flex-1 gap-2 overflow-x-auto p-2">Exchange</div>
}

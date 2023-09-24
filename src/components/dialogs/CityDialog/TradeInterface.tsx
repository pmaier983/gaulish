import { type Ship } from "schema"
import { CityTradeCard } from "~/components/CityTradeCard"
import { ShipTradeCard } from "~/components/ShipTradeCard"
import { type BaseInterfaceProps } from "~/components/dialogs/CityDialog"

export interface TradeInterfaceProps extends BaseInterfaceProps {
  tradeShip?: Ship
  toggleSelectedCityId: (newSelectedCityId?: number) => void
}

export const TradeInterface = ({
  tradeShip,
  selectedCity,
  toggleSelectedCityId,
}: TradeInterfaceProps) => (
  <div className="flex max-w-full flex-1 gap-2 p-2">
    <ShipTradeCard tradeShip={tradeShip} selectedCity={selectedCity} />
    <CityTradeCard
      onClickCityId={toggleSelectedCityId}
      selectedCity={selectedCity}
    />
  </div>
)

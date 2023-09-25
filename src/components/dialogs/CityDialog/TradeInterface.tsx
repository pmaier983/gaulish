import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { CityTradeCard } from "~/components/CityTradeCard"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { ShipHeader } from "~/components/ShipHeader"
import { ShipTradeCard } from "~/components/ShipTradeCard"
import { ExitButton } from "~/components/buttons/ExitButton"
import { type ShipComposite } from "~/state/gamestateStore"
import { getCargoSum } from "~/utils/utils"

export interface TradeInterfaceProps extends ComponentPropsWithRef<"div"> {
  tradeShip?: ShipComposite
  selectedCity?: City
  toggleSelectedCityId: (newSelectedCityId?: number) => void
  toggleSelectedTradeShipId: (newSelectedTradeShipId?: string) => void
}

export const TradeInterface = ({
  tradeShip,
  selectedCity,
  toggleSelectedCityId,
  toggleSelectedTradeShipId,
  className,
}: TradeInterfaceProps) => {
  if (!selectedCity || !tradeShip) {
    return (
      <div className="flex max-w-full flex-1 flex-col gap-2 p-2">
        <TradeInterfaceHeader
          tradeShip={tradeShip}
          selectedCity={selectedCity}
          toggleSelectedCityId={toggleSelectedCityId}
          toggleSelectedTradeShipId={toggleSelectedTradeShipId}
        />
        <div className="flex flex-1 flex-row">
          <ShipTradeCard tradeShip={tradeShip} selectedCity={selectedCity} />
          <CityTradeCard
            onClickCityId={toggleSelectedCityId}
            selectedCity={selectedCity}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`flex max-w-full flex-1 flex-col gap-2 p-2 ${className}`}>
      <TradeInterfaceHeader
        tradeShip={tradeShip}
        selectedCity={selectedCity}
        toggleSelectedCityId={toggleSelectedCityId}
        toggleSelectedTradeShipId={toggleSelectedTradeShipId}
      />
      <div className="flex flex-1 flex-row">TODO</div>
    </div>
  )
}

interface TradeInterfaceHeaderProps extends ComponentPropsWithRef<"div"> {
  tradeShip?: ShipComposite
  selectedCity?: City
  toggleSelectedCityId: (newSelectedCityId?: number) => void
  toggleSelectedTradeShipId: (newSelectedTradeShipId?: string) => void
}

export const TradeInterfaceHeader = ({
  tradeShip,
  selectedCity,
  toggleSelectedCityId,
  toggleSelectedTradeShipId,
  className,
}: TradeInterfaceHeaderProps) => {
  return (
    <h3 className={`grid grid-cols-3 items-center ${className}`}>
      {tradeShip ? (
        <div className="flex flex-row gap-1">
          <ShipHeader shipId={tradeShip.id} />
          <ExitButton
            label="Revert Ship Selection"
            onClick={() => toggleSelectedTradeShipId()}
          />
        </div>
      ) : (
        <span className="text-2xl">Select A Ship</span>
      )}

      <div className="flex flex-row justify-center gap-2">
        {tradeShip && (
          <ImageIconCount id="GOLD" count={tradeShip?.cargo.gold} />
        )}
        {tradeShip && (
          <CargoCount
            cargoCapacity={tradeShip.cargoCapacity}
            currentCargo={getCargoSum(tradeShip.cargo)}
          />
        )}
      </div>

      {selectedCity ? (
        <div className="flex justify-end gap-1 text-xl">
          <div className="">{selectedCity.name}</div>
          <ExitButton
            label="Revert City Selection"
            onClick={() => toggleSelectedCityId()}
          />
        </div>
      ) : (
        <span className="flex justify-end text-2xl">Select A City</span>
      )}
    </h3>
  )
}

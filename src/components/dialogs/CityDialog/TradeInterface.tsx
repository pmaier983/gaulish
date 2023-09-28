import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { CityTradeCard } from "~/components/CityTradeCard"
import { FormatNumber } from "~/components/FormatNumber"
import { ImageIcon } from "~/components/ImageIcon"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { PriceSlider } from "~/components/PriceSlider"
import { ShipHeader } from "~/components/ShipHeader"
import { ShipTradeCard } from "~/components/ShipTradeCard"
import { ExitButton } from "~/components/buttons/ExitButton"
import { type ShipComposite } from "~/state/gamestateStore"
import { getCargoSum, getPrice } from "~/utils/utils"

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
        <div className="flex flex-1 flex-row gap-2">
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
      {selectedCity.cityCargo.map((cargo) => {
        const cargoPrice = getPrice({ ...cargo, seed: selectedCity.id })

        return (
          <div
            key={cargo.type}
            className="grid grid-cols-[1fr_4rem_1fr] border-b-2 border-dashed border-black pb-2 pt-2"
          >
            <div className="flex flex-1 flex-row pl-2 pr-2">
              <PriceSlider
                price={cargoPrice}
                type="SELL"
                ship={tradeShip}
                cargoType={cargo.type}
                onSubmit={(val) => {
                  console.log("wow!", val)
                }}
              />
            </div>
            <div className="flex min-w-[4rem] flex-row content-center items-center gap-2">
              <ImageIcon id={cargo.type} />
              <FormatNumber number={cargoPrice} isGold />
            </div>
            <div className="flex flex-1 flex-row ">
              <PriceSlider
                price={cargoPrice}
                type="BUY"
                ship={tradeShip}
                cargoType={cargo.type}
                onSubmit={(val) => {
                  console.log("wow!", val)
                }}
              />
            </div>
          </div>
        )
      })}
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
    <div className="flex flex-col gap-1">
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
      <div className="h-[2px] w-full bg-black" />
    </div>
  )
}

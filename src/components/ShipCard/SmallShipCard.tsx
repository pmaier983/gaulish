import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type InnerCommonShipCardProps } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { ExchangeButton } from "~/components/Button/ExchangeButton"
import { SailButton } from "~/components/Button/SailButton"
import { TradeButton } from "~/components/Button/TradeButton"
import { getCargoSum } from "~/utils"

export interface SmallShipCardProps {}

export const SmallShipCard = ({
  ship,
  isSelectedShip,
  isSailing,
  toggleShipSelection,
  shipExchangeClick,
  shipTradeClick,
}: SmallShipCardProps & InnerCommonShipCardProps) => {
  return (
    <article
      className={`flex w-full max-w-[20rem] flex-col gap-2 rounded p-2 outline outline-1 outline-black ${
        isSelectedShip ? "outline-4 outline-red-600" : ""
      }`}
    >
      <div className="flex flex-row items-center justify-between">
        <ShipHeader shipId={ship.id} />
        <SailButton
          onClick={() => toggleShipSelection(ship)}
          className=" justify-center"
          disabled={isSailing}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <ImageIconCount icon="GOLD" count={ship.cargo.gold} />
        <CargoCount
          currentCargo={getCargoSum(ship.cargo)}
          cargoCapacity={ship.cargoCapacity}
        />
        <ExchangeButton
          disabled={isSailing}
          onClick={() => shipExchangeClick({ newExchangeShipId: ship.id })}
        />
        <TradeButton
          onClick={() =>
            shipTradeClick({
              newTradeShipId: ship.id,
              newSelectedCityId: ship.cityId,
            })
          }
          disabled={isSailing}
        />
      </div>
    </article>
  )
}

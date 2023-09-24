import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type CommonShipCardProps } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { ExchangeButton } from "~/components/buttons/ExchangeButton"
import { SailButton } from "~/components/buttons/SailButton"
import { TradeButton } from "~/components/buttons/TradeButton"

interface SmallShipCardProps extends CommonShipCardProps {}

export const SmallShipCard = ({
  ship,
  isSelectedShip,
  isSailing,
  toggleShipSelection,
  shipExchangeClick,
  shipTradeClick,
}: SmallShipCardProps) => {
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
        <ImageIconCount id="GOLD" count={ship.cargo.gold} />
        <CargoCount
          currentCargo={
            ship.cargo.stone +
            ship.cargo.wheat +
            ship.cargo.wood +
            ship.cargo.wool
          }
          cargoCapacity={ship.cargoCapacity}
        />
        <ExchangeButton
          disabled={isSailing}
          onClick={() => shipExchangeClick([ship.id])}
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

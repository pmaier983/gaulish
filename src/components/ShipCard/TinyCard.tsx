import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type CommonShipCardProps } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { TradeButton } from "~/components/buttons/TradeButton"
import { getCargoSum } from "~/utils/utils"

interface TinyShipCardProps extends CommonShipCardProps {}

export const TinyShipCard = ({
  ship,
  isSelectedShip,
  isSailing,
  shipTradeClick,
  className,
}: TinyShipCardProps) => {
  return (
    <article
      className={`flex w-full max-w-[25rem] flex-row justify-between gap-3 rounded p-2 outline outline-1 outline-black ${
        isSelectedShip ? "outline-4 outline-red-600" : ""
      } ${className}`}
    >
      <ShipHeader shipId={ship.id} />
      <div className="flex-2 flex flex-row justify-end gap-5">
        <ImageIconCount id="GOLD" count={ship.cargo.gold} />
        <CargoCount
          currentCargo={getCargoSum(ship.cargo)}
          cargoCapacity={ship.cargoCapacity}
        />
        <TradeButton
          disabled={isSailing}
          onClick={() =>
            shipTradeClick({
              newTradeShipId: ship.id,
              newSelectedCityId: ship.cityId,
            })
          }
        />
      </div>
    </article>
  )
}

import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type CommonShipCardProps } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { TradeButton } from "~/components/buttons/TradeButton"

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
      className={`flex w-full max-w-[25rem] flex-row justify-between gap-2 rounded p-2 outline outline-1 outline-black ${
        isSelectedShip ? "outline-4 outline-red-600" : ""
      } ${className}`}
    >
      <ShipHeader shipId={ship.id} />
      <div className="flex flex-1 flex-row justify-end gap-5">
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
        <TradeButton disabled={isSailing} onClick={() => shipTradeClick()} />
      </div>
    </article>
  )
}

import { ImageIcon } from "~/components/ImageIcon"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type CommonShipCardProps } from "~/components/ShipCard"
import { Tooltip } from "~/components/Tooltip"
import { TooltipShipNameEditor } from "~/components/TooltipShipNameEditor"
import { ExchangeButton } from "~/components/buttons/ExchangeButton"
import { SailButton } from "~/components/buttons/SailButton"
import { TradeButton } from "~/components/buttons/TradeButton"

interface SmallShipCardProps extends CommonShipCardProps {}

export const SmallShipCard = ({
  ship,
  isSelectedShip,
  isSailing,
  city,
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
        <div className="flex flex-row">
          <ImageIcon id={ship.shipType} />
          <div className="flex flex-col pl-2">
            <Tooltip
              interactive
              content={
                <TooltipShipNameEditor text={ship.name} shipId={ship.id} />
              }
            >
              {/* TODO: what proper html tag to use for prominence within articles? h4 or what */}
              <span className="h-5 whitespace-nowrap text-xl leading-5">
                {ship.name}
              </span>
            </Tooltip>
            <div className="h-5 whitespace-nowrap leading-5">
              {isSailing ? "Sailing" : city?.name ?? "Loading..."}
            </div>
          </div>
        </div>
        <SailButton
          onClick={() => toggleShipSelection(ship)}
          className=" justify-center"
          disabled={isSailing}
        />
      </div>
      <div className="flex flex-row items-center justify-between">
        <ImageIconCount id="GOLD" count={ship.gold} />
        <CargoCount
          currentCargo={ship.stone + ship.wheat + ship.wood + ship.wool}
          cargoCapacity={ship.cargoCapacity}
        />
        <ExchangeButton
          disabled={isSailing}
          onClick={() => shipExchangeClick()}
        />
        <TradeButton onClick={() => shipTradeClick()} disabled={isSailing} />
      </div>
    </article>
  )
}

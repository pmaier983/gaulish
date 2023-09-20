import { ImageIcon } from "~/components/ImageIcon"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type CommonShipCardProps } from "~/components/ShipCard"
import { Tooltip } from "~/components/Tooltip"
import { TooltipShipNameEditor } from "~/components/TooltipShipNameEditor"
import { ExchangeButton } from "~/components/buttons/ExchangeButton"
import { SailButton } from "~/components/buttons/SailButton"
import { TradeButton } from "~/components/buttons/TradeButton"

interface LargeShipCardProps extends CommonShipCardProps {}

export const LargeShipCard = ({
  ship,
  isSailing,
  city,
  toggleOpenState,
  toggleShipSelection,
  shipExchangeClick,
  shipTradeClick,
}: LargeShipCardProps) => {
  return (
    // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
    <article className="flex min-h-[300px] min-w-[200px] flex-col gap-2 rounded-md border border-black p-2">
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
      <div className="flex flex-row items-center gap-3">
        <SailButton
          onClick={() => {
            toggleOpenState(false)
            toggleShipSelection(ship)
          }}
          className=" justify-center"
          disabled={isSailing}
        />
        <ExchangeButton
          disabled={isSailing}
          onClick={() => shipExchangeClick()}
        />
        <TradeButton
          className="flex-1 justify-center"
          onClick={() => shipTradeClick()}
          disabled={isSailing}
        />
      </div>
      <div className="flex flex-row items-center justify-around">
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
      </div>
      <div className="h-[2px] w-full bg-black" />
      <div className="grid grid-cols-2 gap-2">
        <ImageIconCount id="STONE" count={ship.cargo.stone} />
        <ImageIconCount id="WHEAT" count={ship.cargo.wheat} />
        <ImageIconCount id="WOOL" count={ship.cargo.wool} />
        <ImageIconCount id="WOOD" count={ship.cargo.wood} />
      </div>
    </article>
  )
}

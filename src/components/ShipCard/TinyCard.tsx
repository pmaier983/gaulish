import {
  IconButton,
  type IconButtonProps,
} from "~/components/Button/IconButton"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type InnerCommonShipCardProps } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { getCargoSum } from "~/utils/utils"

export interface TinyShipCardProps {
  iconButtonProps?: IconButtonProps
}

export const TinyShipCard = ({
  ship,
  isSelectedShip,
  isSailing,
  shipTradeClick,
  className,
  iconButtonProps = {
    label: "Trade",
    iconProps: {
      id: "trade",
    },
  },
}: TinyShipCardProps & InnerCommonShipCardProps) => {
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
        <IconButton
          className="bg-green-400 hover:text-green-800 active:bg-green-500"
          disabled={isSailing}
          onClick={() =>
            shipTradeClick({
              newTradeShipId: ship.id,
              newSelectedCityId: ship.cityId,
            })
          }
          {...iconButtonProps}
        />
      </div>
    </article>
  )
}

import {
  IconButton,
  type IconButtonProps,
} from "~/components/Button/IconButton"
import { ImageIconCount, ShipCargoCount } from "~/components/ImageIconCount"
import { type InnerCommonShipCardProps } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { type ShipComposite } from "~/state/gamestateStore"

export interface TinyShipCardProps {
  iconButtonProps?: IconButtonProps
  onClick?: (ship: ShipComposite) => void
  hasButton?: boolean
}

export const TinyShipCard = ({
  ship,
  isSelectedShip,
  isSailing,
  onClick,
  className,
  hasButton = true,
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
        <ImageIconCount icon="GOLD" count={ship.cargo.gold} />
        <ShipCargoCount ship={ship} />
        {hasButton && (
          <IconButton
            className="bg-green-400 hover:text-green-800 active:bg-green-500"
            disabled={isSailing}
            onClick={() => {
              if (onClick) {
                onClick(ship)
              }
            }}
            {...iconButtonProps}
          />
        )}
      </div>
    </article>
  )
}

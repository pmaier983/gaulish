import { ImageIcon } from "~/components/ImageIcon"
import { type ShipComposite } from "~/state/gamestateStore"

const SHIP_CARD_TYPES = {
  SMALL: "SMALL",
  LARGE: "LARGE",
}

export type ShipCardType = keyof typeof SHIP_CARD_TYPES

interface ShipCardProps {
  ship: ShipComposite
  type: ShipCardType
}

export const ShipCard = ({ ship, type }: ShipCardProps) => {
  switch (type) {
    case "SMALL": {
      return <article className="">TODO</article>
    }
    default:
    case "LARGE": {
      return (
        // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
        <article className="flex min-h-[300px] min-w-[200px] rounded-md border border-black p-2">
          <div className="flex h-fit flex-row items-center gap-3">
            <ImageIcon id={ship.shipType} size="32" />
            <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl">
              {ship.name}
            </h3>
          </div>
        </article>
      )
    }
  }
}

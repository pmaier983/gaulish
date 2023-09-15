import { ImageIcon } from "~/components/ImageIcon"
import { type ShipComposite } from "~/state/gamestateStore"

interface ShipProps {
  ship: ShipComposite
}

export const ShipCard = ({ ship }: ShipProps) => {
  return (
    <div className="flex min-h-[300px] min-w-[200px] rounded-md p-2 outline outline-1 outline-black">
      <ImageIcon id={ship.shipType} size="32" />
    </div>
  )
}

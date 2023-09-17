import { ImageIcon } from "~/components/ImageIcon"
import { type ShipComposite } from "~/state/gamestateStore"

interface ShipProps {
  ship: ShipComposite
}

export const ShipCard = ({ ship }: ShipProps) => {
  return (
    // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
    <div className="flex min-h-[300px] min-w-[200px] rounded-md border border-black p-2">
      <ImageIcon id={ship.shipType} size="32" />
    </div>
  )
}

import { ImageIcon } from "~/components/ImageIcon"
import { renderFormattedNumber } from "~/utils/formatUtils"
import { type CitySummary } from "~/utils/utils"

interface CityCardProps extends Omit<CitySummary, "id"> {
  onClick: () => void
  className?: string
}

export const CityCard = ({
  name,
  shipCount,
  cargo,
  gold,
  onClick,
  className,
}: CityCardProps) => {
  return (
    <button
      key={name}
      onClick={onClick}
      // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
      className={`flex flex-col items-center rounded-md border border-black p-2 ${className}`}
    >
      <h3 className="text-xl max-sm:text-base">{name}</h3>
      {/* TODO: test these when the numbers get large! */}
      <div className="flex flex-row items-center gap-2 max-sm:sr-only">
        <div className="flex flex-row gap-1">
          <ImageIcon id="SHIP" /> {shipCount}
        </div>
        <div className="flex flex-row gap-1">
          <ImageIcon id="GOLD" /> {renderFormattedNumber(gold)}
        </div>
        <div className="flex flex-row gap-1">
          <ImageIcon id="CARGO" /> {cargo.currentCargo}/{cargo.cargoCapacity}
        </div>
      </div>
    </button>
  )
}

import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type CitySummary } from "~/utils/utils"

export interface ShipFocusedCityCardProps {
  citySummary: CitySummary
  onClick: () => void
  className?: string
}

export const ShipFocusedCityCard = ({
  citySummary,
  onClick,
  className,
}: ShipFocusedCityCardProps) => {
  return (
    <button
      onClick={() => onClick()}
      // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
      className={`flex flex-col items-center rounded-md border border-black p-2 ${className}`}
    >
      <h3 className="text-xl max-sm:text-base">{citySummary.name}</h3>
      {/* TODO: test these when the numbers get large! */}
      <div className="flex flex-row items-center gap-2 max-sm:sr-only">
        <ImageIconCount icon="SHIP" count={citySummary.shipCount} />
        <ImageIconCount icon="GOLD" count={citySummary.gold} />
        <CargoCount
          cargoCapacity={citySummary.cargo.cargoCapacity}
          currentCargo={citySummary.cargo.currentCargo}
        />
      </div>
    </button>
  )
}

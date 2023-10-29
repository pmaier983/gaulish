import { type IMAGE_ICON, IMAGE_ICONS } from "~/components/ImageIcon"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { type InnerCommonShipCardProps } from "~/components/ShipCard"
import { ShipHeader } from "~/components/ShipHeader"
import { ExchangeButton } from "~/components/Button/ExchangeButton"
import { SailButton } from "~/components/Button/SailButton"
import { TradeButton } from "~/components/Button/TradeButton"
import { getCargoSum } from "~/utils"

export interface LargeShipCardProps {
  className?: string
}

export const LargeShipCard = ({
  ship,
  isSailing,
  toggleOpenState,
  toggleShipSelection,
  shipExchangeClick,
  shipTradeClick,
  className,
}: LargeShipCardProps & InnerCommonShipCardProps) => {
  const cargoArray = Object.entries(ship.cargo).filter(
    // This is a Type guard https://www.typescriptlang.org/docs/handbook/advanced-types.html#type-guards-and-differentiating-types
    (input: [string, number | string]): input is [IMAGE_ICON, number] => {
      const [cargoType, cargoCount] = input
      return (
        // Ensure we only render valid cargo with counts > 0
        IMAGE_ICONS.hasOwnProperty(cargoType) &&
        typeof cargoCount === "number" &&
        cargoCount > 0
      )
    },
  )

  return (
    // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
    <article
      className={`flex min-h-[300px] min-w-[200px] max-w-[320px] flex-col gap-2 rounded-md border border-black p-2 ${className}`}
    >
      <ShipHeader shipId={ship.id} />
      <div className="flex flex-row items-center gap-3">
        <SailButton
          onClick={() => {
            toggleOpenState(false)
            toggleShipSelection(ship)
          }}
          disabled={isSailing}
        />
        <ExchangeButton
          disabled={isSailing}
          onClick={() => shipExchangeClick({ newExchangeShipId: ship.id })}
        />
        <TradeButton
          className="flex-1 justify-center"
          onClick={() =>
            shipTradeClick({
              newTradeShipId: ship.id,
              newSelectedCityId: ship.cityId,
            })
          }
          disabled={isSailing}
        />
      </div>
      <div className="flex flex-row items-center justify-around">
        <ImageIconCount icon="GOLD" count={ship.cargo.gold} />
        <CargoCount
          currentCargo={getCargoSum(ship.cargo)}
          cargoCapacity={ship.cargoCapacity}
        />
      </div>
      <div className="h-[2px] w-full bg-black" />
      <div className="grid grid-cols-2 gap-2">
        {cargoArray.map(([cargoType, cargoCount]) => (
          <ImageIconCount key={cargoType} icon={cargoType} count={cargoCount} />
        ))}
        {cargoArray.length === 0 && <div>No cargo</div>}
      </div>
    </article>
  )
}

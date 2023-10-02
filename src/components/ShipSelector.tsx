import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { IconButton } from "~/components/Button/IconButton"
import { ShipCard } from "~/components/ShipCard"
import { type ShipComposite } from "~/state/gamestateStore"
import { api } from "~/utils/api"

interface ShipTradeCardProps extends ComponentPropsWithRef<"div"> {
  side: "LEFT" | "RIGHT"
  selectedCity?: City
  selectedShip?: ShipComposite
  onSelection: (ship: ShipComposite) => void
  onSelectionCancel: (ship: ShipComposite) => void
}

export const ShipSelector = ({
  side,
  selectedShip,
  selectedCity,
  onSelection,
  className,
}: ShipTradeCardProps) => {
  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: [],
  })

  const visibleShips = ships.filter((ship) => {
    if (!selectedCity) return true
    return ship.cityId === selectedCity.id
  })

  // If there is no selectedShip, render a ship selection interface
  if (!selectedShip) {
    return (
      <div
        className={`flex min-w-[320px] flex-1 flex-col items-center gap-2 rounded-md ${className}`}
      >
        {visibleShips.map((ship) =>
          side === "LEFT" ? (
            <div className="flex w-full flex-row gap-3" key={ship.id}>
              <ShipCard type="TINY" ship={ship} hasButton={false} />
              <IconButton
                iconProps={{ id: "arrow-left-circle" }}
                label="Select Ship"
                onClick={() => {
                  onSelection(ship)
                }}
                className="bg-blue-400 hover:text-blue-800 active:bg-blue-500"
              />
            </div>
          ) : (
            <div className="flex w-full flex-row gap-3" key={ship.id}>
              <IconButton
                iconProps={{ id: "arrow-right-circle" }}
                label="Select Ship"
                onClick={() => {
                  onSelection(ship)
                }}
                className="bg-blue-400 hover:text-blue-800 active:bg-blue-500"
              />
              <ShipCard
                key={ship.id}
                type="TINY"
                ship={ship}
                hasButton={false}
              />
            </div>
          ),
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-1 justify-center">
      <ShipCard type="LARGE" ship={selectedShip} />
    </div>
  )
}

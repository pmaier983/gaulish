import { type ComponentPropsWithRef } from "react"
import { IconButton } from "~/components/Button/IconButton"
import { SwapButton } from "~/components/Button/SwapButton"
import { ShipCard } from "~/components/ShipCard"
import { type ShipComposite } from "~/state/gamestateStore"

interface ShipTradeCardProps extends ComponentPropsWithRef<"div"> {
  side: "LEFT" | "RIGHT"
  selectedShip?: ShipComposite
  ships: ShipComposite[]
  onSelection: (ship: ShipComposite) => void
  onSelectionCancel: (ship: ShipComposite) => void
}

export const ShipSelector = ({
  side,
  selectedShip,
  ships,
  onSelection,
  className,
}: ShipTradeCardProps) => {
  if (selectedShip) {
    return (
      <div className={`flex flex-1 flex-row gap-3 ${className}`}>
        <ShipCard type="LARGE" ship={selectedShip} className="flex-1" />
        <SwapButton
          onClick={() => {
            onSelection(selectedShip)
          }}
        />
      </div>
    )
  }

  if (ships.length === 0) {
    return (
      <div
        className={`flex flex-1 items-center justify-center text-2xl ${className}`}
      >
        No Available Ships at this City
      </div>
    )
  }

  // If there is no selectedShip, render a ship selection interface
  if (!selectedShip) {
    return (
      <div
        className={`flex min-w-[320px] flex-1 flex-col items-center gap-2 rounded-md ${className}`}
      >
        {ships.map((ship) => (
          <div
            className={`flex w-full flex-row gap-3 ${
              side === "LEFT" ? "" : "flex-row-reverse"
            }`}
            key={ship.id}
          >
            <ShipCard type="TINY" ship={ship} hasButton={false} />
            <IconButton
              iconProps={{
                id:
                  side === "LEFT" ? "arrow-left-circle" : "arrow-right-circle",
              }}
              label="Select Ship"
              onClick={() => {
                onSelection(ship)
              }}
              className="bg-blue-400 hover:text-blue-800 active:bg-blue-500"
            />
          </div>
        ))}
      </div>
    )
  }
}

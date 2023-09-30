import * as Slider from "@radix-ui/react-slider"
import { useState } from "react"

import styles from "./priceSlider.module.css"
import { type ShipComposite } from "~/state/gamestateStore"
import { type CargoTypes } from "schema"
import { PurchasePriceButton } from "~/components/buttons/PurchasePriceButton"
import { getCargoSum } from "~/utils/utils"

interface SliderProps extends Omit<Slider.SliderProps, "onSubmit"> {
  type: "BUY" | "SELL"
  cargoType: CargoTypes
  price: number
  ship: ShipComposite
  onSubmit: (value: number) => void
  externalValue?: number[]
  className?: string
}

/**
 * Only use this as a price slider.
 * Make a new component for other slider uses.
 */
export const PriceSlider = ({
  defaultValue,
  cargoType,
  ship,
  onSubmit,
  price,
  type,
  className,
  ...rest
}: SliderProps) => {
  const [value, setInternalValue] = useState<number[]>(defaultValue ?? [0])

  const shipGold = ship.cargo.gold

  const valueNumber = value.at(0)!

  const totalPrice = price * valueNumber

  const maxPossibleAfforded = Math.floor(shipGold / price)

  const maxValue =
    type === "BUY"
      ? Math.min(ship.cargoCapacity, maxPossibleAfforded)
      : ship.cargo[cargoType]

  // TODO: probably better to refactor this using HookForm & Zod
  const whyIsButtonDisabled = (() => {
    if (totalPrice > shipGold) {
      return "Not enough gold on this ship to purchase"
    }
    if (totalPrice === 0) {
      return "Nothing to purchase"
    }
    if (type === "BUY" && ship.cargoCapacity - getCargoSum(ship.cargo) === 0) {
      return "Not enough cargo space"
    }
    return false
  })()

  const isButtonDisabled = !!whyIsButtonDisabled

  const isValueChangeDisabled = type === "SELL" ? maxValue === 0 : false

  if (type === "SELL" && maxValue === 0)
    return (
      <div className="flex flex-1 items-center justify-center">
        Nothing to Sell
      </div>
    )

  return (
    <form
      className="flex flex-1 flex-row gap-2"
      onSubmit={() => onSubmit(valueNumber)}
    >
      <Slider.Root
        className={`relative flex flex-1 touch-none select-none items-center ${className}`}
        onValueChange={setInternalValue}
        value={value}
        min={0}
        max={maxValue}
        disabled={isValueChangeDisabled}
        {...rest}
      >
        <Slider.Track className="relative h-2 flex-1 rounded bg-slate-400 data-[disabled]:opacity-50">
          <Slider.Range className="absolute h-full rounded bg-amber-400" />
        </Slider.Track>
        <Slider.Thumb
          className="block h-4 w-4 rounded-full bg-amber-900 data-[disabled]:opacity-0"
          aria-label="Volume"
        />
      </Slider.Root>
      <input
        type="number"
        className={`m-0 w-[2rem] self-center rounded p-1 text-center outline outline-1 outline-black disabled:opacity-50 ${styles.numberInput}`}
        value={valueNumber}
        min={0}
        max={maxValue}
        disabled={isValueChangeDisabled}
        onChange={(e) =>
          setInternalValue([parseInt(e.currentTarget.value, 10)])
        }
      />
      <PurchasePriceButton
        label={type.toLocaleLowerCase()}
        price={totalPrice}
        disabled={isButtonDisabled}
        type={type}
        onClick={() => onSubmit(valueNumber)}
        tooltipContent={whyIsButtonDisabled}
      />
    </form>
  )
}

import { useState } from "react"

import { type ShipComposite } from "~/state/gamestateStore"
import { type CargoTypes } from "schema"
import { PurchasePriceButton } from "~/components/Button/PurchasePriceButton"
import { getCargoSum } from "~/utils"
import { Slider, type SliderProps } from "~/components/Slider"

import styles from "~/styles/utils.module.css"

interface PriceSliderProps extends Omit<SliderProps, "onSubmit" | "label"> {
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
}: PriceSliderProps) => {
  const [value, setInternalValue] = useState<number[]>(defaultValue ?? [0])

  const shipGold = ship.cargo.gold

  const valueNumber = value.at(0)!

  const totalPrice = price * valueNumber

  const maxValue = type === "BUY" ? ship.cargoCapacity : ship.cargo[cargoType]

  // TODO: probably better to refactor this using HookForm & Zod
  const whyIsButtonDisabled = (() => {
    if (type === "BUY") {
      if (totalPrice > shipGold) {
        return "Not enough gold on this ship to purchase"
      }
      if (totalPrice === 0) {
        return "Nothing to buy"
      }
      if (ship.cargoCapacity - getCargoSum(ship.cargo) === 0) {
        return "Not enough cargo space"
      }
    }
    if (type === "SELL") {
      if (valueNumber === 0) {
        return "Nothing to sell"
      }
    }
    return false
  })()

  const isButtonDisabled = !!whyIsButtonDisabled

  const isValueChangeDisabled = maxValue === 0

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
      <Slider
        className={`relative flex min-w-[5rem] flex-1 touch-none select-none items-center ${className}`}
        onValueChange={setInternalValue}
        value={value}
        min={0}
        max={maxValue}
        disabled={isValueChangeDisabled}
        label="Purchase Amount"
        {...rest}
      />
      <input
        type="number"
        className={`m-0 w-[2rem] self-center rounded p-1 text-center outline outline-1 outline-black disabled:opacity-50 ${styles.removeNumberArrows}`}
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

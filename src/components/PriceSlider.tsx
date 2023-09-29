import * as Slider from "@radix-ui/react-slider"
import { useState } from "react"
import { FormatNumber } from "~/components/FormatNumber"

import styles from "./priceSlider.module.css"
import { type ShipComposite } from "~/state/gamestateStore"
import { type CargoTypes } from "schema"

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

  const valueNumber = value.at(0)!

  const totalPrice = price * valueNumber

  const lowercaseCargoType = cargoType.toLocaleLowerCase() as Lowercase<
    typeof cargoType
  >

  const maxValue =
    type === "BUY" ? ship.cargoCapacity : ship.cargo[lowercaseCargoType]

  const isButtonDisabled = totalPrice > ship.cargo.gold || totalPrice === 0

  const isValueChangeDisabled = type === "SELL" ? maxValue === 0 : false

  const color = type === "BUY" ? "red" : "green"

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
      <div
        className={`flex flex-row items-center rounded bg-${color}-400 outline outline-1 outline-black`}
      >
        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault()
            onSubmit(valueNumber)
          }}
          disabled={isButtonDisabled}
          className={`p-2 capitalize hover:bg-${color}-500 hover:text-white active:bg-${color}-700 disabled:bg-slate-300 disabled:text-white`}
        >
          {type.toLocaleLowerCase()}
        </button>
        <div className="h-full w-[1px] bg-black" />

        <FormatNumber
          number={totalPrice}
          isGold
          className={`w-[4rem] bg-${color}-200 p-2`}
        />
      </div>
    </form>
  )
}

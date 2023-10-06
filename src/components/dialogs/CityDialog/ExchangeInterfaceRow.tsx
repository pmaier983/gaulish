import { useState, type ComponentPropsWithRef, useEffect } from "react"
import { FormatNumberChange } from "~/components/FormatNumberChange"

import { type IMAGE_ICON } from "~/components/ImageIcon"
import { ImageIconCount } from "~/components/ImageIconCount"
import { Slider } from "~/components/Slider"

import styles from "~/styles/utils.module.css"

interface ExchangeInterfaceRowProps extends ComponentPropsWithRef<"div"> {
  icon: IMAGE_ICON
  value: number
  onValueChange: (value: number) => void
  leftValue: number
  rightValue: number
}

export const ExchangeInterfaceRow = ({
  value,
  onValueChange,
  leftValue,
  rightValue,
  icon,
  className,
}: ExchangeInterfaceRowProps) => {
  const sumValue = leftValue + rightValue
  const [leftInnerValue, setLeftValue] = useState(sumValue - value)
  const [rightInnerValue, setRightValue] = useState(value)

  useEffect(() => {
    setLeftValue(sumValue - value)
    setRightValue(value)
    // TODO: interestingly this only resets on first value change...
  }, [sumValue, value])

  return (
    <div className={`grid grid-cols-[1fr_2fr_1fr] items-center ${className}`}>
      <div className="flex">
        <ImageIconCount icon={icon} count={leftValue} />
      </div>
      <div className="flex flex-row items-center justify-center gap-2">
        <div className="flex w-[4rem] flex-row items-center justify-between gap-2">
          <FormatNumberChange valueChange={sumValue - value - leftValue} />
          <input
            type="number"
            className={`m-0 self-center rounded p-1 text-center outline outline-1 outline-black disabled:opacity-50 ${styles.removeNumberArrows}`}
            value={leftInnerValue}
            min={0}
            max={sumValue}
            onChange={(e) => setLeftValue(parseInt(e.currentTarget.value, 10))}
            onBlur={(e) => {
              const newPossibleValue = Math.abs(
                parseInt(e.currentTarget.value, 10) - sumValue,
              )
              const boundedValue = Math.max(
                Math.min(newPossibleValue, sumValue),
                0,
              )
              onValueChange(boundedValue)
            }}
          />
        </div>
        <Slider
          label="Exchange Amount"
          min={0}
          max={sumValue}
          onValueChange={(newValue) => onValueChange(newValue.at(0)!)}
          value={[value]}
        />
        <div className="flex w-[4rem] flex-row items-center justify-between gap-2">
          <input
            type="number"
            className={`m-0 self-center rounded p-1 text-center outline outline-1 outline-black disabled:opacity-50 ${styles.removeNumberArrows}`}
            value={rightInnerValue}
            min={0}
            max={sumValue}
            onChange={(e) => setRightValue(parseInt(e.currentTarget.value, 10))}
            onBlur={(e) => {
              const newPossibleValue = Math.abs(
                parseInt(e.currentTarget.value, 10),
              )
              const boundedValue = Math.max(
                Math.min(newPossibleValue, sumValue),
                0,
              )

              onValueChange(boundedValue)
            }}
          />
          <FormatNumberChange valueChange={value - rightValue} />
        </div>
      </div>
      <div className="flex flex-row-reverse">
        <ImageIconCount
          icon={icon}
          count={rightValue}
          className="flex-row-reverse"
        />
      </div>
    </div>
  )
}

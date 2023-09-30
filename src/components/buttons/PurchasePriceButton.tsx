import { type ComponentPropsWithRef } from "react"
import { FormatNumber } from "~/components/FormatNumber"
import { Tooltip } from "~/components/Tooltip"

interface PurchasePriceButtonProps
  extends Omit<ComponentPropsWithRef<"button">, "type" | "onClick"> {
  label: string
  price: number
  type: "BUY" | "SELL"
  onClick: () => void
  tooltipContent?: React.ReactNode
}

export const PurchasePriceButton = ({
  label,
  price,
  type,
  tooltipContent,
  onClick,
  className,
  ...props
}: PurchasePriceButtonProps) => {
  const buttonStyles = {
    SELL: "bg-green-400 hover:bg-green-500 active:bg-green-800 ",
    BUY: "bg-red-400 hover:bg-red-500 active:bg-red-800 ",
  }

  return (
    <div
      className={`flex flex-row items-center rounded  outline outline-1 outline-black ${className}`}
    >
      <Tooltip content={tooltipContent} disabled={!tooltipContent}>
        {/* https://www.radix-ui.com/primitives/docs/components/tooltip#displaying-a-tooltip-from-a-disabled-button */}
        <span tabIndex={0}>
          <button
            type="submit"
            className={`flex p-2 capitalize text-black hover:text-white active:text-white disabled:bg-slate-400 disabled:opacity-50 disabled:hover:text-black ${buttonStyles[type]}`}
            onClick={(e) => {
              e.preventDefault()
              onClick()
            }}
            {...props}
          >
            {label}
          </button>
        </span>
      </Tooltip>
      <div className="h-full w-[1px] bg-black" />

      <FormatNumber
        number={price}
        isGold
        className={`flex w-[4rem] flex-1 justify-center p-1 `}
      />
    </div>
  )
}

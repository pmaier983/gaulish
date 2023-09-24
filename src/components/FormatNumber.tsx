import { type ComponentPropsWithRef } from "react"
import { Tooltip } from "~/components/Tooltip"

export const getFormattedNumber = (number: number) => {
  const compactNumber = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number)

  return compactNumber
}

interface FormatNumberProps extends ComponentPropsWithRef<"div"> {
  number: number
  isGold?: boolean
}

export const FormatNumber = ({
  number,
  isGold,
  className,
}: FormatNumberProps) => {
  const compactNumber = getFormattedNumber(number)

  if (compactNumber === number.toString()) {
    return (
      <div className={`${className}`}>
        {compactNumber}
        {isGold ? "gp" : ""}
      </div>
    )
  }

  return (
    <Tooltip content={number}>
      <div className={`${className}`}>
        {compactNumber}
        {isGold ? "gp" : ""}
      </div>
    </Tooltip>
  )
}

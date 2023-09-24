import { type ComponentPropsWithRef } from "react"
import { Tooltip } from "~/components/Tooltip"

interface GetFormattedNumberInputs {
  number: number
  isGold?: boolean
}

export const getFormattedNumber = ({
  number,
  isGold,
}: GetFormattedNumberInputs) => {
  const compactNumber = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(number)

  if (isGold) {
    return compactNumber + "g"
  }

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
  const compactNumber = getFormattedNumber({ number, isGold })

  if (compactNumber === number.toString()) {
    return <div className={`${className}`}>{compactNumber}</div>
  }

  return (
    <Tooltip content={number}>
      <div className={`${className}`}>{compactNumber}</div>
    </Tooltip>
  )
}

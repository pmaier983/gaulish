import { Tooltip } from "~/components/Tooltip"

export const renderFormattedNumber = (number: number) => {
  const formattedNumber = Intl.NumberFormat("en-US", {
    notation: "standard",
    maximumFractionDigits: 1,
  }).format(number)
  const compactNumber = Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number)

  // If there is no formatting needed, don't render the tooltip
  if (compactNumber === formattedNumber) {
    return compactNumber
  }

  return (
    <Tooltip content={formattedNumber}>
      <div>{compactNumber}</div>
    </Tooltip>
  )
}

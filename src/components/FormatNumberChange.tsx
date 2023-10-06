import { type ComponentPropsWithRef } from "react"

interface FormatNumberChangeProps extends ComponentPropsWithRef<"div"> {
  valueChange: number
}

export const FormatNumberChange = ({
  valueChange,
  className = "",
}: FormatNumberChangeProps) => {
  const isPositive = valueChange > 0

  if (valueChange === 0) return <div className={`${className}`}>0</div>

  return (
    <div
      className={` ${
        isPositive ? "text-green-600" : "text-red-600"
      } ${className}`}
    >
      {isPositive ? "+" : "-"}
      {Math.abs(valueChange)}
    </div>
  )
}

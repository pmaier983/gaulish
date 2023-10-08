import { type ComponentPropsWithoutRef } from "react"
import { IconButton } from "~/components/Button/IconButton"

export interface TradeButtonProps extends ComponentPropsWithoutRef<"button"> {}

export const TradeButton = ({ className, ...props }: TradeButtonProps) => {
  return (
    <IconButton
      className={` bg-green-400 hover:text-green-800 active:bg-green-500 ${className}`}
      label="Trade"
      iconProps={{
        icon: "trade",
      }}
      {...props}
    />
  )
}

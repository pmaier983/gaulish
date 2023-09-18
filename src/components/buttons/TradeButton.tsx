import { type ComponentPropsWithoutRef } from "react"

import { Icon } from "~/components/Icon"

interface TradeButtonProps extends ComponentPropsWithoutRef<"button"> {}

export const TradeButton = ({ ...props }: TradeButtonProps) => {
  return (
    <button {...props}>
      <Icon id="trade" />
      <span className="sr-only">Trade</span>
    </button>
  )
}

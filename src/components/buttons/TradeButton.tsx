import { type ComponentPropsWithoutRef } from "react"

import { Icon } from "~/components/Icon"

interface TradeButtonProps extends ComponentPropsWithoutRef<"button"> {}

export const TradeButton = ({ className, ...props }: TradeButtonProps) => {
  return (
    <button
      className={`flex flex-row items-center rounded bg-green-400 p-1.5 text-white outline outline-1 outline-black hover:text-green-800 active:bg-green-500 disabled:opacity-30 ${className}`}
      {...props}
    >
      <Icon id="trade" />
      <span className="sr-only">Trade</span>
    </button>
  )
}

import { type ComponentPropsWithRef } from "react"

import { Icon } from "~/components/Icon"

interface ExchangeButtonProps extends ComponentPropsWithRef<"button"> {}

export const ExchangeButton = ({
  className,
  ...props
}: ExchangeButtonProps) => {
  return (
    <button {...props} className={`flex flex-row ${className}`}>
      <Icon id="arrowLeft" strokeWidth="3" />
      <Icon id="arrowRight" strokeWidth="3" />
      <span className="sr-only">Exchange</span>
    </button>
  )
}

import { type ComponentPropsWithRef } from "react"

import { Icon } from "~/components/Icon"

interface ExchangeButtonProps extends ComponentPropsWithRef<"button"> {}

export const ExchangeButton = ({
  className,
  ...props
}: ExchangeButtonProps) => {
  return (
    <button
      {...props}
      className={`flex flex-row items-center rounded bg-sky-200 p-1.5 text-white outline outline-1 outline-black hover:bg-sky-300 active:bg-sky-400 disabled:opacity-30 ${className}`}
    >
      <Icon id="arrowLeft" strokeWidth="3" className="text-sky-800" />
      <Icon id="arrowRight" strokeWidth="3" className="text-cyan-600" />
      <span className="sr-only">Exchange</span>
    </button>
  )
}

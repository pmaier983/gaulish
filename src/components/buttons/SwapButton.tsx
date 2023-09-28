import { type ComponentPropsWithRef } from "react"

import { Icon } from "~/components/Icon"

interface SwapButtonProps extends ComponentPropsWithRef<"button"> {
  label: string
}

export const SwapButton = ({ className, label, ...props }: SwapButtonProps) => {
  return (
    <button
      {...props}
      className={`flex h-min flex-row items-center rounded bg-blue-400 p-1 text-white outline outline-1 outline-blue-600 hover:bg-blue-500 active:bg-blue-500 active:text-blue-900 disabled:opacity-30 ${className}`}
    >
      <Icon id="refresh-cw" strokeWidth="2" />
      <span className="sr-only">{label}</span>
    </button>
  )
}

import { type ComponentPropsWithRef } from "react"

import { Icon } from "~/components/Icon"

export interface ExitButtonProps extends ComponentPropsWithRef<"button"> {
  label: string
}

export const ExitButton = ({ className, label, ...props }: ExitButtonProps) => {
  return (
    <button
      {...props}
      className={`flex h-min flex-row items-center rounded bg-red-400 text-white outline outline-1 outline-red-600 hover:bg-red-500 active:bg-red-500 active:text-red-900 disabled:opacity-30 ${className}`}
    >
      <Icon id="x-square" strokeWidth="2" />
      <span className="sr-only">{label}</span>
    </button>
  )
}

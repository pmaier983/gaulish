import { type ComponentPropsWithRef } from "react"

import { Icon } from "~/components/Icon"

interface SailButtonProps extends ComponentPropsWithRef<"button"> {}

export const SailButton = ({ className, ...props }: SailButtonProps) => {
  return (
    <button
      {...props}
      className={`flex flex-row items-center rounded bg-sky-400 p-1.5 text-white outline outline-1 outline-black hover:bg-sky-500 active:bg-sky-600 disabled:opacity-30 ${className}`}
    >
      <Icon id="map" />
      <span className="sr-only">Set Sail</span>
    </button>
  )
}

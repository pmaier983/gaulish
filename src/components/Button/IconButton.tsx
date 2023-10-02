import { type ComponentPropsWithRef } from "react"

import { Icon, type IconProps } from "~/components/Icon"

export interface IconButtonProps extends ComponentPropsWithRef<"button"> {
  iconProps: IconProps
  label: string
}

export const IconButton = ({
  className,
  label,
  iconProps,
  ...props
}: IconButtonProps) => {
  return (
    <button
      {...props}
      className={`flex h-min flex-row items-center justify-center self-center rounded p-1.5 text-white outline outline-1 outline-black disabled:opacity-30 ${className}`}
    >
      <Icon {...iconProps} />
      <span className="sr-only">{label}</span>
    </button>
  )
}

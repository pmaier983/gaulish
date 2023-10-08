import { type ComponentPropsWithRef } from "react"
import { IconButton } from "~/components/Button/IconButton"

export interface SwapButtonProps extends ComponentPropsWithRef<"button"> {
  label?: string
}

export const SwapButton = ({
  className,
  label = "Swap",
  ...props
}: SwapButtonProps) => {
  return (
    <IconButton
      className={`bg-blue-400 hover:bg-blue-500 active:bg-blue-500 active:text-blue-900 ${className}`}
      label={label}
      iconProps={{
        icon: "refresh-cw",
      }}
      {...props}
    />
  )
}

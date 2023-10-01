import { type ComponentPropsWithRef } from "react"
import { IconButton } from "~/components/Button/IconButton"

export interface SailButtonProps extends ComponentPropsWithRef<"button"> {}

export const SailButton = ({ className, ...props }: SailButtonProps) => {
  return (
    <IconButton
      className={`bg-sky-400 hover:bg-sky-500 active:bg-sky-600 ${className}`}
      label="Set Sail"
      iconProps={{
        strokeWidth: "2",
        id: "map",
      }}
      {...props}
    />
  )
}

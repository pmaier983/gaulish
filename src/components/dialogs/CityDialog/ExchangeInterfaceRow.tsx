import { type ComponentPropsWithRef } from "react"
import { type IMAGE_ICON, ImageIcon } from "~/components/ImageIcon"

interface ExchangeInterfaceRowProps extends ComponentPropsWithRef<"div"> {
  icon: IMAGE_ICON
}

export const ExchangeInterfaceRow = ({
  icon,
  className,
}: ExchangeInterfaceRowProps) => {
  return (
    <div className={`grid grid-cols-3 ${className}`}>
      <div>
        <ImageIcon id={icon} />
      </div>
    </div>
  )
}

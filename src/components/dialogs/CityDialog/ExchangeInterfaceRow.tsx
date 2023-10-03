import { type ComponentPropsWithRef } from "react"

import { type IMAGE_ICON, ImageIcon } from "~/components/ImageIcon"
import { Slider } from "~/components/Slider"

interface ExchangeInterfaceRowProps extends ComponentPropsWithRef<"div"> {
  icon: IMAGE_ICON
}

export const ExchangeInterfaceRow = ({
  icon,
  className,
}: ExchangeInterfaceRowProps) => {
  return (
    <div className={`grid grid-cols-3 items-center ${className}`}>
      <div>
        <ImageIcon id={icon} />
      </div>
      <div>
        <Slider label="Exchange Amount" />
      </div>
      <div className="flex flex-row-reverse">
        <ImageIcon id={icon} />
      </div>
    </div>
  )
}

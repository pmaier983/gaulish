import { type ComponentPropsWithRef } from "react"
import { type IMAGE_ICON, ImageIcon } from "~/components/ImageIcon"
import { renderFormattedNumber } from "~/utils/formatUtils"

interface ImageIconCountProps extends ComponentPropsWithRef<"div"> {
  id: IMAGE_ICON
  count: number
}

export const ImageIconCount = ({
  id,
  count,
  className,
}: ImageIconCountProps) => {
  return (
    <div className={`flex flex-row gap-2 text-xl leading-5 ${className}`}>
      <ImageIcon id={id} />
      <div>{renderFormattedNumber(count)}</div>
    </div>
  )
}

export interface CargoCountProps extends ComponentPropsWithRef<"div"> {
  currentCargo: number
  cargoCapacity: number
}

export const CargoCount = ({
  className,
  currentCargo,
  cargoCapacity,
}: CargoCountProps) => {
  return (
    <div className={`flex flex-row items-center gap-2 ${className}`}>
      <ImageIcon id="CARGO" />
      <div className="flex flex-1 flex-col items-center text-xl leading-5">
        <div>{renderFormattedNumber(currentCargo)}</div>
        <div className="h-[2px] w-full bg-black"></div>
        <div>{renderFormattedNumber(cargoCapacity)}</div>
      </div>
    </div>
  )
}

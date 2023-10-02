import { type ComponentPropsWithRef } from "react"
import { FormatNumber } from "~/components/FormatNumber"
import { type IMAGE_ICON, ImageIcon } from "~/components/ImageIcon"
import { type ShipComposite } from "~/state/gamestateStore"
import { getCargoSum } from "~/utils/utils"

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
    <div
      className={`flex flex-row items-center justify-center gap-2 text-xl leading-5 ${className}`}
    >
      <ImageIcon id={id} />
      <FormatNumber number={count} />
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
        <FormatNumber number={currentCargo} />
        <div className="h-[2px] w-full bg-black"></div>
        <FormatNumber number={cargoCapacity} />
      </div>
    </div>
  )
}

interface ShipCargoCountProps
  extends Omit<CargoCountProps, "currentCargo" | "cargoCapacity"> {
  ship: ShipComposite
}

export const ShipCargoCount = ({ ship, ...rest }: ShipCargoCountProps) => (
  <CargoCount
    cargoCapacity={ship.cargoCapacity}
    currentCargo={getCargoSum(ship.cargo)}
    {...rest}
  />
)

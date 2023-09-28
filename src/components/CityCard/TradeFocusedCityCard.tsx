import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { FormatNumber } from "~/components/FormatNumber"
import { Icon } from "~/components/Icon"
import { ImageIcon } from "~/components/ImageIcon"
import { Tooltip } from "~/components/Tooltip"
import { getPrice } from "~/utils/utils"

interface TradeFocusedCityCardProps extends ComponentPropsWithRef<"div"> {
  city: City
  onClick: () => void
  hasButton?: boolean
}

export const TradeFocusedCityCard = ({
  city,
  onClick,
  hasButton = true,
  className,
}: TradeFocusedCityCardProps) => {
  return (
    <div
      className={`flex max-w-[23rem] flex-row flex-wrap items-center gap-y-2 rounded-md p-2 pr-0 outline outline-1 outline-black ${className}`}
    >
      <div className="flex w-[8.5rem] flex-row">
        {hasButton && (
          <button
            onClick={onClick}
            className="rounded bg-blue-400 p-1 text-white outline outline-1 outline-black hover:text-blue-800 active:bg-blue-500"
          >
            <Icon id="arrow-right-circle" />
            <span className="sr-only">Select City</span>
          </button>
        )}
        <Tooltip content={city.name}>
          <div className=" overflow-hidden text-ellipsis pl-1 pr-1 text-xl">
            {city.name}
          </div>
        </Tooltip>
      </div>
      {city.cityCargo
        .sort((cargoA, cargoB) => cargoA.midline - cargoB.midline)
        .map((cargo) => (
          <div key={cargo.type} className="flex w-[4.25rem] flex-row gap-1">
            <ImageIcon id={cargo.type} className="min-w-[24px]" />
            <FormatNumber
              number={getPrice({ ...cargo, seed: city.id })}
              isGold
            />
          </div>
        ))}
    </div>
  )
}

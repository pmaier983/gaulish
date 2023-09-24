import { type CommonCityCardProps } from "~/components/CityCard"
import { FormatNumber } from "~/components/FormatNumber"
import { Icon } from "~/components/Icon"
import { ImageIcon } from "~/components/ImageIcon"
import { Tooltip } from "~/components/Tooltip"
import { getPrice } from "~/utils/utils"

interface TradeFocusedCityCardProps
  extends Pick<CommonCityCardProps, "city" | "onClick"> {}

export const TradeFocusedCityCard = ({
  city,
  onClick,
}: TradeFocusedCityCardProps) => {
  return (
    <div className="flex max-w-[23rem] flex-row flex-wrap items-center gap-y-2 rounded-md p-2 pr-0 outline outline-1 outline-black">
      <button
        onClick={onClick}
        className="rounded bg-blue-400 p-2 text-white outline outline-1 outline-black hover:text-blue-800 active:bg-blue-500"
      >
        <Icon id="arrowRightCircle" />
        <span className="sr-only">Select City</span>
      </button>
      <Tooltip content={city.name}>
        <div className="w-[6.5rem] overflow-hidden text-ellipsis pl-1 pr-1 text-xl">
          {city.name}
        </div>
      </Tooltip>
      {city.cityCargo
        .sort((cargoA, cargoB) => cargoA.midline - cargoB.midline)
        .map((cargo) => (
          <div key={cargo.type} className="flex w-[4.5rem] flex-row gap-1">
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

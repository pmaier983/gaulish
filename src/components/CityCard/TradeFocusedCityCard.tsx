import { type CommonCityCardProps } from "~/components/CityCard"
import { ImageIcon } from "~/components/ImageIcon"
import { Tooltip } from "~/components/Tooltip"
import { getPrice } from "~/utils/utils"

interface TradeFocusedCityCardProps extends Pick<CommonCityCardProps, "city"> {}

export const TradeFocusedCityCard = ({ city }: TradeFocusedCityCardProps) => {
  return (
    <div className="flex min-w-[14.5rem] max-w-[25rem] flex-row flex-wrap items-center gap-2 rounded-md p-2 outline outline-1 outline-black">
      <Tooltip content={city.name}>
        <div className="w-[6.5rem] overflow-hidden text-ellipsis text-xl">
          {city.name}
        </div>
      </Tooltip>
      {city.cityCargo.sort().map((cargo) => (
        <div key={cargo.type} className="flex w-[3rem] flex-row gap-1">
          <ImageIcon id={cargo.type} className="min-w-[24px]" />
          {getPrice({ ...cargo, seed: city.id })}
        </div>
      ))}
    </div>
  )
}

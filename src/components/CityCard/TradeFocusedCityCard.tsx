import { type City } from "schema"
import { FormatNumber } from "~/components/FormatNumber"
import { ImageIcon } from "~/components/ImageIcon"
import { Tooltip } from "~/components/Tooltip"
import { useGetPrice } from "~/hooks/useGetPrice"

import styles from "./TradeFocusedCityCard.module.css"

export interface TradeFocusedCityCardProps {
  className?: string
  city: City
}

export const TradeFocusedCityCard = ({
  city,
  className,
}: TradeFocusedCityCardProps) => {
  const { getPrice } = useGetPrice()

  return (
    <div className={`${styles.containerGrid} ${className}`}>
      <div className={`${styles.title}`}>
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
            <ImageIcon icon={cargo.type} className="min-w-[24px]" />
            <FormatNumber
              number={getPrice({ ...cargo, seed: city.id })}
              isGold
            />
          </div>
        ))}
    </div>
  )
}

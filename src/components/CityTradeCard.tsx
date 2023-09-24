import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { TradeFocusedCityCard } from "~/components/CityCard/TradeFocusedCityCard"
import { api } from "~/utils/api"

interface CityTradeCardProps extends ComponentPropsWithRef<"div"> {
  onClickCityId: (newSelectedCityId?: number) => void
  selectedCity?: City
}

export const CityTradeCard = ({
  onClickCityId,
  selectedCity,
  className,
}: CityTradeCardProps) => {
  const { data: cities } = api.map.getCities.useQuery(undefined, {
    staleTime: Infinity,
    // TODO: use an empty array or fetch from queryClient?
    initialData: [],
  })

  if (!selectedCity) {
    return (
      <div
        className={`flex min-w-[320px] flex-1 flex-col items-center gap-2 rounded p-2  ${className}`}
      >
        <div className="text-2xl">Select a City</div>
        {cities.map((city) => (
          <TradeFocusedCityCard
            city={city}
            key={city.id}
            onClick={() => onClickCityId(city.id)}
          />
        ))}
      </div>
    )
  }

  return <div className="flex flex-1">TODO</div>
}

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

  // If there is no selected city, render a city selection interface
  if (!selectedCity) {
    return (
      <div
        className={`flex min-w-[280px] flex-1 flex-col items-end gap-2 rounded ${className}`}
      >
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

  return (
    <TradeFocusedCityCard
      city={selectedCity}
      key={selectedCity.id}
      onClick={() => onClickCityId(selectedCity.id)}
      className="h-min self-center"
      hasButton={false}
    />
  )
}

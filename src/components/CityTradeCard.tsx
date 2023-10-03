import { type ComponentPropsWithRef } from "react"
import { type City } from "schema"
import { TradeFocusedCityCard } from "~/components/CityCard/TradeFocusedCityCard"
import { SwapButton } from "~/components/Button/SwapButton"
import { api } from "~/utils/api"
import { IconButton } from "~/components/Button/IconButton"

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
          <div className="flex w-full flex-row gap-3" key={city.id}>
            <IconButton
              iconProps={{ id: "arrow-right-circle" }}
              label="Select City"
              onClick={() => onClickCityId(city.id)}
              className="bg-blue-400 hover:text-blue-800 active:bg-blue-500"
            />
            <TradeFocusedCityCard city={city} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-row items-center gap-3">
      <SwapButton
        label="revet city selection"
        onClick={() => onClickCityId()}
      />
      <TradeFocusedCityCard
        city={selectedCity}
        key={selectedCity.id}
        className="h-min"
      />
    </div>
  )
}

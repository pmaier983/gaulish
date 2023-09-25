import { ShipFocusedCityCard } from "~/components/CityCard/ShipFocusedCityCard"
import { TradeFocusedCityCard } from "~/components/CityCard/TradeFocusedCityCard"
import { api } from "~/utils/api"
import { getCitySummaries } from "~/utils/utils"

export const CITY_CARD_TYPES = {
  SHIP_FOCUSED: "SHIP_FOCUSED",
  TRADE_FOCUSED: "TRADE_FOCUSED",
}

export type CityCardType = keyof typeof CITY_CARD_TYPES

interface CityCardProps {
  type: CityCardType
  cityId: number
  onClick: () => void
  className?: string
}

export const CityCard = ({ type, cityId, ...rest }: CityCardProps) => {
  const { data: cities } = api.map.getCities.useQuery(undefined, {
    staleTime: Infinity,
    // TODO: use an empty array or fetch from queryClient?
    initialData: [],
  })

  const { data: knownTiles } = api.map.getKnownTiles.useQuery(undefined, {
    staleTime: Infinity,
    initialData: [],
  })

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: [],
  })

  const knownCities = cities.filter((city) =>
    knownTiles.includes(city.xyTileId),
  )

  const city = cities.find((city) => city.id === cityId)

  const citySummaries = getCitySummaries(knownCities, ships)

  // TODO: handle cities loading state better
  if (!city) return null

  const citySummary = citySummaries.find(
    (citySummary) => citySummary.id === cityId,
  )!

  switch (type) {
    case CITY_CARD_TYPES.TRADE_FOCUSED: {
      return <TradeFocusedCityCard city={city} {...rest} />
    }
    default:
    case CITY_CARD_TYPES.SHIP_FOCUSED: {
      return <ShipFocusedCityCard citySummary={citySummary} {...rest} />
    }
  }
}

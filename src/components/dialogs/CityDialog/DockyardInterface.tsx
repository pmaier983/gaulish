import { type City } from "schema"
import { IconButton } from "~/components/Button/IconButton"
import { ImageIconCount } from "~/components/ImageIconCount"
import { DockyardTable } from "~/components/dialogs/CityDialog/DockyardTable"
import { useCityDialogStore } from "~/state/cityDialogStore"
import { api } from "~/utils/api"

export interface DockyardInterfaceProps {
  selectedCity?: City
}

export const DockyardInterface = ({ selectedCity }: DockyardInterfaceProps) => {
  const { toggleSelectedCityId } = useCityDialogStore((state) => ({
    toggleSelectedCityId: state.toggleSelectedCityId,
  }))
  const queryClient = api.useUtils()

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: [],
  })

  const { data: cities } = api.map.getCities.useQuery(undefined, {
    staleTime: Infinity,
    // TODO: use an empty array or fetch from queryClient?
    initialData: [],
  })

  const { data: knownTiles } = api.map.getKnownTiles.useQuery(undefined, {
    staleTime: Infinity,
    // Avoid no data "loading state" as it should in theory never happen
    initialData: () => queryClient.map.getKnownTiles.getData() ?? [],
  })

  const knownCities = cities.filter((city) =>
    knownTiles.includes(city.xyTileId),
  )

  if (!selectedCity) {
    return (
      <div className="flex flex-1 flex-col items-center gap-2 overflow-x-auto p-2">
        <h2 className="text-2xl">Select A City</h2>
        {knownCities.map((city) => {
          const totalGoldInCity = ships.reduce((acc, ship) => {
            if (ship.cityId === city.id) {
              return acc + ship.cargo.gold
            }
            return acc
          }, 0)

          return (
            <div
              key={city.id}
              className="flex h-fit w-1/2 flex-row justify-between gap-2 rounded p-2 outline outline-1 outline-black"
            >
              <div className="flex flex-row gap-2">
                <IconButton
                  label="Select City"
                  iconProps={{
                    icon: "arrow-right-circle",
                  }}
                  onClick={() => toggleSelectedCityId(city.id)}
                  className="bg-blue-400 hover:text-blue-800 active:bg-blue-500"
                />
                <h3 className="text-2xl">{city.name}</h3>
              </div>
              <ImageIconCount
                count={totalGoldInCity}
                icon="GOLD"
                className="flex-row-reverse"
              />
            </div>
          )
        })}
      </div>
    )
  }

  const totalGoldInSelectedCity = ships.reduce((acc, ship) => {
    if (ship.cityId === selectedCity.id) {
      return acc + ship.cargo.gold
    }
    return acc
  }, 0)

  return (
    <div className="flex flex-1 flex-col p-2">
      <h3 className="flex flex-row justify-center gap-3 p-2 text-2xl">
        Total Gold In Port:
        <ImageIconCount count={totalGoldInSelectedCity} icon="GOLD" />
      </h3>
      <div className="flex flex-1 justify-center">
        <DockyardTable
          totalGoldInSelectedCity={totalGoldInSelectedCity}
          selectedCity={selectedCity}
        />
      </div>
    </div>
  )
}

import { type City } from "schema"
import { IconButton } from "~/components/Button/IconButton"
import { ImageIconCount } from "~/components/ImageIconCount"
import { useCityDialogStore } from "~/state/cityDialogStore"
import { api } from "~/utils/api"

export interface DockyardInterfaceProps {
  selectedCity?: City
}

export const DockyardInterface = ({ selectedCity }: DockyardInterfaceProps) => {
  const { toggleSelectedCityId } = useCityDialogStore((state) => ({
    toggleSelectedCityId: state.toggleSelectedCityId,
  }))
  const queryClient = api.useContext()

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
                    id: "arrow-right-circle",
                  }}
                  onClick={() => toggleSelectedCityId(city.id)}
                  className="bg-blue-400 hover:text-blue-800 active:bg-blue-500"
                />
                <h3 className="text-2xl">{city.name}</h3>
              </div>
              <ImageIconCount
                count={totalGoldInCity}
                id="GOLD"
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
    <div className="grid flex-1 grid-cols-[1fr_3fr]">
      <div className="flex flex-1 bg-red-400">
        <span>
          Total Gold In Port:
          {/* Make a Special Render gold count! */}
          <ImageIconCount count={totalGoldInSelectedCity} id="GOLD" />
        </span>
      </div>
      <div className="flex flex-1 bg-green-400"></div>
    </div>
  )
}

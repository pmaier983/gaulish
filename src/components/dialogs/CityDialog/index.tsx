import * as Dialog from "@radix-ui/react-dialog"
import { type City } from "schema"

import { Icon } from "~/components/Icon"
import {
  DockyardInterface,
  type DockyardInterfaceProps,
} from "~/components/dialogs/CityDialog/DockyardInterface"
import {
  ExchangeInterface,
  type ExchangeInterfaceProps,
} from "~/components/dialogs/CityDialog/ExchangeInterface"
import {
  ShipsInterface,
  type ShipsInterfaceProps,
} from "~/components/dialogs/CityDialog/ShipsInterface"
import {
  TradeInterface,
  type TradeInterfaceProps,
} from "~/components/dialogs/CityDialog/TradeInterface"
import { DialogWrapper } from "~/components/dialogs/DialogWrapper"
import { api } from "~/utils/api"
import { type CitySummary, getCitySummaries } from "~/utils/utils"

import {
  CityDialogInterface,
  CITY_DIALOG_INTERFACES,
  useCityDialogStore,
} from "~/state/cityDialogStore"
import { ShipFocusedCityCard } from "~/components/CityCard/ShipFocusedCityCard"

export interface BaseInterfaceProps {
  selectedCity?: City
}

// Much of the tailwind css in this file was copied from here:
// https://github1s.com/shadcn-ui/ui/blob/HEAD/apps/www/registry/default/ui/dialog.tsx
export const CityDialog = () => {
  const {
    selectedCityId,
    cityDialogInterface,
    selectedTradeShipId,
    selectedExchangeShipIds,
    toggleSelectedCityId,
    setCityDialogInterface,
  } = useCityDialogStore((state) => ({
    selectedCityId: state.selectedCityId,
    cityDialogInterface: state.cityDialogInterface,
    selectedTradeShipId: state.selectedTradeShipId,
    selectedExchangeShipIds: state.selectedExchangeShipIds,
    toggleSelectedCityId: state.toggleSelectedCityId,
    setCityDialogInterface: state.setCityDialogInterface,
  }))

  const queryClient = api.useContext()

  const { data: cities } = api.map.getCities.useQuery(undefined, {
    staleTime: Infinity,
  })

  const { data: knownTiles } = api.map.getKnownTiles.useQuery(undefined, {
    staleTime: Infinity,
    // Avoid no data "loading state" as it should in theory never happen
    initialData: () => queryClient.map.getKnownTiles.getData() ?? [],
  })

  const { data: ships } = api.ships.getUsersShips.useQuery(undefined, {
    staleTime: Infinity,
    initialData: () =>
      // We are already fetching a list of all the cities, lets re-use that data!
      // Avoid no data "loading state" as it should in theory never happen
      queryClient.ships.getUsersShips.getData() ?? [],
  })

  if (!cities) {
    // TODO: handle cities loading state better
    return null
  }

  const knownCities = cities.filter((city) =>
    knownTiles.includes(city.xyTileId),
  )

  const selectedCity = cities.find((city) => city.id === selectedCityId)

  const tradeShip = ships.find((ship) => ship.id === selectedTradeShipId)

  const selectedExchangeShips = ships.filter((ship) =>
    selectedExchangeShipIds.includes(ship.id),
  )

  return (
    <CityDialogCommonContent
      selectedCity={selectedCity}
      toggleSelectedCityId={toggleSelectedCityId}
      setCityDialogInterface={setCityDialogInterface}
      cityDialogInterface={cityDialogInterface}
      citySummaries={getCitySummaries(knownCities, ships)}
    >
      <CityDialogInterface
        // TODO consider if its better to separate props to avoid re-renders here
        cityDialogInterface={cityDialogInterface}
        selectedCity={selectedCity}
        tradeShip={tradeShip}
        selectedExchangeShips={selectedExchangeShips}
        toggleSelectedCityId={toggleSelectedCityId}
      />
    </CityDialogCommonContent>
  )
}

interface CityDialogCommonContentProps {
  selectedCity?: City
  toggleSelectedCityId: (newSelectedCityId?: number) => void
  setCityDialogInterface: (newCityDialogInterface: CityDialogInterface) => void
  cityDialogInterface: CityDialogInterface
  citySummaries: CitySummary[]

  children?: React.ReactNode
}

const CityDialogCommonContent = ({
  selectedCity,
  toggleSelectedCityId,
  setCityDialogInterface,
  cityDialogInterface: currentCityDialogInterface,
  citySummaries,
  children,
}: CityDialogCommonContentProps) => (
  // TODO: configure using react grid for mobile!
  <DialogWrapper className="flex h-full max-h-[500px] min-h-[300px] w-full min-w-[330px] max-w-[85%] p-3">
    <div className="flex max-w-full flex-1 flex-row justify-between gap-2 max-sm:flex-col">
      {/* Sidebar */}
      <nav className="flex flex-col gap-3 overflow-y-auto">
        <h3 className="self-center text-2xl">
          {selectedCity ? selectedCity.name : "Select a City"}
        </h3>
        {citySummaries
          // TODO: is there a better way to sort cities? By name?
          .sort((cityA, cityB) => cityB.shipCount - cityA.shipCount)
          .map((citySummary) => (
            <ShipFocusedCityCard
              key={citySummary.name}
              citySummary={citySummary}
              className={
                selectedCity?.name == citySummary.name ? "bg-blue-300" : ""
              }
              onClick={() => toggleSelectedCityId(citySummary.id)}
            />
          ))}
      </nav>
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {/* Header */}
        <nav
          // TODO: what are these paddings required to avoid border being cut off?
          className="flex justify-between"
          aria-label="Interaction Methods"
        >
          <Dialog.Description className="sr-only">
            A Modal that allows you to interact with your ships docked at a
            specific city, as well as Trade with the city exchange and buy more
            ships
          </Dialog.Description>
          <div className="flex gap-2">
            {Object.values(CITY_DIALOG_INTERFACES).map(
              (cityDialogInterface) => (
                <button
                  key={cityDialogInterface}
                  className={`flex items-center rounded pl-2 pr-2 text-2xl capitalize outline outline-1 ${
                    cityDialogInterface === currentCityDialogInterface &&
                    "bg-blue-300"
                  }`}
                  onClick={() => setCityDialogInterface(cityDialogInterface)}
                >
                  {cityDialogInterface.toLocaleLowerCase()}
                </button>
              ),
            )}
          </div>
          <Dialog.Close className="focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-sm opacity-70 ring-offset-black transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
            <Icon id="x" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </nav>
        {/* Main Content */}
        <div className="flex flex-1 overflow-y-auto rounded-md outline-dashed outline-1 outline-black">
          {children}
        </div>
      </div>
    </div>
  </DialogWrapper>
)

// TODO: rework this to only pass props where needed
type CityDialogInterfaceProps = {
  cityDialogInterface: CityDialogInterface
} & BaseInterfaceProps &
  DockyardInterfaceProps &
  TradeInterfaceProps &
  ExchangeInterfaceProps &
  ShipsInterfaceProps

const CityDialogInterface = ({
  cityDialogInterface,
  ...props
}: CityDialogInterfaceProps) => {
  switch (cityDialogInterface) {
    case CITY_DIALOG_INTERFACES.TRADE: {
      return <TradeInterface {...props} />
    }
    case CITY_DIALOG_INTERFACES.EXCHANGE: {
      return <ExchangeInterface {...props} />
    }
    case CITY_DIALOG_INTERFACES.DOCKYARD: {
      return <DockyardInterface {...props} />
    }
    default:
    case CITY_DIALOG_INTERFACES.SHIPS: {
      return <ShipsInterface {...props} />
    }
  }
}

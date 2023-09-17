import * as Dialog from "@radix-ui/react-dialog"
import { type City } from "schema"

import { Icon } from "~/components/Icon"
import { ImageIcon } from "~/components/ImageIcon"
import { DockyardInterface } from "~/components/dialogs/CityDialog/DockyardInterface"
import { ExchangeInterface } from "~/components/dialogs/CityDialog/ExchangeInterface"
import { ShipsInterface } from "~/components/dialogs/CityDialog/ShipsInterface"
import { TradeInterface } from "~/components/dialogs/CityDialog/TradeInterface"
import { DialogWrapper } from "~/components/dialogs/DialogWrapper"
import { api } from "~/utils/api"
import { type CitySummary, getCitySummaries } from "~/utils/utils"

import { renderFormattedNumber } from "~/utils/formatUtils"
import {
  CityDialogInterface,
  CITY_DIALOG_INTERFACES,
  useCityDialogStore,
} from "~/state/cityDialogStore"

export interface BaseInterfaceProps {
  setCityDialogInterface: (newCityDialogInterface: CityDialogInterface) => void
}

// Much of the tailwind css in this file was copied from here:
// https://github1s.com/shadcn-ui/ui/blob/HEAD/apps/www/registry/default/ui/dialog.tsx
export const CityDialog = () => {
  const { selectedCity, cityDialogInterface } = useCityDialogStore((state) => ({
    selectedCity: state.selectedCity,
    cityDialogInterface: state.cityDialogInterface,
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

  return (
    <CityDialogCommonContent
      selectedCity={selectedCity}
      cityDialogInterface={cityDialogInterface}
      citySummaries={getCitySummaries(knownCities, ships)}
    >
      <CityDialogInterface cityDialogInterface={cityDialogInterface} />
    </CityDialogCommonContent>
  )
}

interface CityDialogCommonContentProps {
  selectedCity?: City
  cityDialogInterface: CityDialogInterface
  citySummaries: CitySummary[]

  children?: React.ReactNode
}

const CityDialogCommonContent = ({
  selectedCity,
  cityDialogInterface: currentCityDialogInterface,
  citySummaries,
  children,
}: CityDialogCommonContentProps) => {
  const selectedCitySummary = citySummaries.find(
    (citySummary) => citySummary.id === selectedCity?.id,
  )
  return (
    // TODO: configure using react grid for mobile!
    <DialogWrapper className="flex max-h-[500px] min-w-[330px] max-w-[100%] p-3">
      <div className="flex flex-1 flex-row justify-between gap-2 max-sm:flex-col">
        {/* Sidebar */}
        <nav className="flex flex-col gap-3 overflow-y-auto">
          {/* We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll) */}
          {selectedCitySummary && (
            <div className="flex flex-col items-center rounded-md border border-black bg-blue-400 p-2">
              <Dialog.Title className="text-2xl max-sm:text-base">
                {selectedCitySummary.name}
              </Dialog.Title>
              {/* TODO: test these when the numbers get large! */}
              <div className="flex flex-row items-center gap-2 max-sm:sr-only">
                <div className="flex flex-row gap-1">
                  <ImageIcon id="SHIP" /> {selectedCitySummary.shipCount}
                </div>
                <div className="flex flex-row gap-1">
                  <ImageIcon id="GOLD" />{" "}
                  {renderFormattedNumber(selectedCitySummary.gold)}
                </div>
                <div className="flex flex-row gap-1">
                  <ImageIcon id="CARGO" />{" "}
                  {selectedCitySummary.cargo.currentCargo}/
                  {selectedCitySummary.cargo.cargoCapacity}
                </div>
              </div>
            </div>
          )}
          {citySummaries
            .filter((citySummary) => citySummary.id !== selectedCity?.id)
            .map((citySummary) => (
              <button
                key={citySummary.id}
                // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
                className="flex flex-col items-center rounded-md border border-black p-2"
              >
                <h3 className="text-xl max-sm:text-base">{citySummary.name}</h3>
                {/* TODO: test these when the numbers get large! */}
                <div className="flex flex-row items-center gap-2 max-sm:sr-only">
                  <div className="flex flex-row gap-1">
                    <ImageIcon id="SHIP" /> {citySummary.shipCount}
                  </div>
                  <div className="flex flex-row gap-1">
                    <ImageIcon id="GOLD" />{" "}
                    {renderFormattedNumber(citySummary.gold)}
                  </div>
                  <div className="flex flex-row gap-1">
                    <ImageIcon id="CARGO" /> {citySummary.cargo.currentCargo}/
                    {citySummary.cargo.cargoCapacity}
                  </div>
                </div>
              </button>
            ))}
        </nav>
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Header */}
          <nav
            // TODO: what are these paddings required to avoid border being cut off?
            className="flex justify-between "
            aria-label="Interaction Methods"
          >
            <Dialog.Description className="sr-only">
              A Modal that allows you to interact with your ships docked at a
              specific city, as well as Trade with the city exchange and buy
              more ships
            </Dialog.Description>
            <div className="flex gap-2">
              {Object.values(CITY_DIALOG_INTERFACES).map(
                (cityDialogInterface) => (
                  <button
                    key={cityDialogInterface}
                    className={`flex items-center rounded pl-2 pr-2 capitalize outline outline-1 ${
                      cityDialogInterface === currentCityDialogInterface &&
                      "bg-blue-300"
                    }`}
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
          <div className="h-2" />
          <div className="rounded-md outline-dashed outline-1 outline-black">
            {children}
          </div>
        </div>
      </div>
    </DialogWrapper>
  )
}

type CityDialogInterfaceProps = {
  cityDialogInterface: CityDialogInterface
}

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

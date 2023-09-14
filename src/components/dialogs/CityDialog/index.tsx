import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"
import { type City } from "schema"

import { Icon } from "~/components/Icon"
import { ImageIcon } from "~/components/ImageIcon"
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

import styles from "./index.module.css"
import { renderFormattedNumber } from "~/utils/formatUtils"

const CITY_DIALOG_INTERFACES = {
  SHIPS: "SHIPS",
  TRADE: "TRADE",
  EXCHANGE: "EXCHANGE",
  DOCKYARD: "DOCKYARD",
} as const

export type CityDialogInterface = keyof typeof CITY_DIALOG_INTERFACES

export interface BaseInterfaceProps {
  setCityDialogInterface: (newCityDialogInterface: CityDialogInterface) => void
}

type JointInterfaceProps =
  | Omit<DockyardInterfaceProps, "setCityDialogInterface">
  | Omit<ShipsInterfaceProps, "setCityDialogInterface">
  | Omit<TradeInterfaceProps, "setCityDialogInterface">
  | Omit<ExchangeInterfaceProps, "setCityDialogInterface">

type CityDialogProps = JointInterfaceProps & {
  initialCityId: number
  initialCityDialogInterface?: CityDialogInterface
}

// Much of the tailwind css in this file was copied from here:
// https://github1s.com/shadcn-ui/ui/blob/HEAD/apps/www/registry/default/ui/dialog.tsx
export const CityDialog = ({
  initialCityId,
  initialCityDialogInterface = "SHIPS",
  ...props
}: CityDialogProps) => {
  const [selectedCityId, setSelectedCityId] = useState(initialCityId)
  const queryClient = api.useContext()
  const [cityDialogInterface, setCityDialogInterface] = useState(
    initialCityDialogInterface,
  )

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

  const selectedCity = knownCities.find((city) => city.id === selectedCityId)

  if (!selectedCity) {
    throw Error("Attempt to render an unknown city")
  }

  return (
    <CityDialogCommonContent
      selectedCity={selectedCity}
      cityDialogInterface={cityDialogInterface}
      setCityDialogInterface={setCityDialogInterface}
      setSelectedCityId={setSelectedCityId}
      citySummaries={getCitySummaries(knownCities, ships)}
    >
      <CityDialogInterface
        cityDialogInterface={cityDialogInterface}
        setCityDialogInterface={setCityDialogInterface}
        {...props}
      />
    </CityDialogCommonContent>
  )
}

interface CityDialogCommonContentProps {
  cityDialogInterface: CityDialogInterface
  setCityDialogInterface: (newCityDialogInterface: CityDialogInterface) => void
  setSelectedCityId: (newCityId: number) => void

  selectedCity: City
  citySummaries: CitySummary[]

  children?: React.ReactNode
}

const CityDialogCommonContent = ({
  setCityDialogInterface,
  setSelectedCityId,
  cityDialogInterface: currentCityDialogInterface,
  selectedCity,
  citySummaries,
  children,
}: CityDialogCommonContentProps) => {
  const selectedCitySummary = citySummaries.find(
    (citySummary) => citySummary.id === selectedCity.id,
  )!
  return (
    // TODO: configure using react grid for mobile!
    <DialogWrapper className="min-w-[330px]">
      <div className={styles.container}>
        {/* Sidebar */}
        <nav className="flex flex-col gap-3">
          <div className="flex flex-col items-center rounded-md bg-blue-400 p-2 outline outline-1 outline-black">
            <Dialog.Title className="text-2xl max-sm:text-base">
              {selectedCity.name}
            </Dialog.Title>
            {/* TODO: test these when the numbers get large! */}
            <div className="flex flex-row items-center gap-2 max-sm:sr-only">
              <div className="flex flex-row gap-1">
                <ImageIcon id="SHIP" /> {selectedCitySummary.shipCount + 100}
              </div>
              <div className="flex flex-row gap-1">
                <ImageIcon id="GOLD" />{" "}
                {renderFormattedNumber(selectedCitySummary.gold + 1998)}
              </div>
              <div className="flex flex-row gap-1">
                <ImageIcon id="CARGO" />{" "}
                {selectedCitySummary.cargo.currentCargo}/
                {selectedCitySummary.cargo.cargoCapacity}
              </div>
            </div>
          </div>
          {citySummaries
            .filter((citySummary) => citySummary.id !== selectedCity.id)
            .map((citySummary) => (
              <button
                key={citySummary.id}
                onClick={() => setSelectedCityId(citySummary.id)}
                className="flex flex-col items-center rounded-md p-2 outline outline-1 outline-black"
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
        {/* Header */}
        <div className="flex flex-1 flex-col">
          <nav
            className="flex h-8 justify-between"
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
          {children}
        </div>
      </div>
    </DialogWrapper>
  )
}

type CityDialogInterfaceProps = JointInterfaceProps & {
  cityDialogInterface: CityDialogInterface
} & BaseInterfaceProps

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

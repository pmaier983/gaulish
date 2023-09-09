import * as Dialog from "@radix-ui/react-dialog"
import { useState } from "react"

import { Icon } from "~/components/Icon"
import { DockyardInterface } from "~/components/dialogs/CityDialog/DockyardInterface"
import { ExchangeInterface } from "~/components/dialogs/CityDialog/ExchangeInterface"
import { ShipsInterface } from "~/components/dialogs/CityDialog/ShipsInterface"
import { TradeInterface } from "~/components/dialogs/CityDialog/TradeInterface"
import { DialogWrapper } from "~/components/dialogs/DialogWrapper"
import { api } from "~/utils/api"

const CITY_DIALOG_INTERFACES = {
  SHIPS: "SHIPS",
  TRADE: "TRADE",
  EXCHANGE: "EXCHANGE",
  DOCKYARD: "DOCKYARD",
} as const

export type CityDialogInterface = keyof typeof CITY_DIALOG_INTERFACES

export interface InterfaceProps {
  setCityDialogInterface: (newCityDialogInterface: CityDialogInterface) => void
}

interface CityDialogProps {
  cityId: number
  initialCityDialogInterface?: CityDialogInterface
}

// Much of the tailwind css in this file was copied from here:
// https://github1s.com/shadcn-ui/ui/blob/HEAD/apps/www/registry/default/ui/dialog.tsx
export const CityDialog = ({
  cityId,
  initialCityDialogInterface = "SHIPS",
}: CityDialogProps) => {
  const queryClient = api.useContext()
  const [cityDialogInterface, setCityDialogInterface] = useState(
    initialCityDialogInterface,
  )
  const { data: city } = api.map.getCityById.useQuery(
    { cityId },
    {
      staleTime: Infinity,
      initialData: () =>
        // We are already fetching a list of all the cities, lets re-use that data!
        queryClient.map.getCities.getData()?.find((city) => city.id === cityId),
    },
  )

  if (!city) {
    // TODO: handle loading state better then this...
    return null
  }

  return (
    <CityDialogCommonContent
      cityName={city.name}
      cityDialogInterface={cityDialogInterface}
      setCityDialogInterface={setCityDialogInterface}
    >
      <CityDialogInterface
        cityDialogInterface={cityDialogInterface}
        setCityDialogInterface={setCityDialogInterface}
      />
    </CityDialogCommonContent>
  )
}

interface CityDialogCommonContentProps {
  cityDialogInterface: CityDialogInterface
  setCityDialogInterface: (newCityDialogInterface: CityDialogInterface) => void
  children?: React.ReactNode
  cityName: string
}

const CityDialogCommonContent = ({
  setCityDialogInterface,
  cityDialogInterface: currentCityDialogInterface,
  cityName,
  children,
}: CityDialogCommonContentProps) => (
  <DialogWrapper>
    <nav className="flex gap-2">
      <Dialog.Description className="sr-only">
        A Modal that allows you to interact with your ships docked at a specific
        city, as well as Trade with the city exchange and buy more ships
      </Dialog.Description>
      {Object.values(CITY_DIALOG_INTERFACES).map((cityDialogInterface) => (
        <button
          key={cityDialogInterface}
          className={`flex items-center rounded pl-2 pr-2 outline outline-1 ${
            cityDialogInterface === currentCityDialogInterface && "bg-blue-300"
          }`}
          onClick={() => setCityDialogInterface(cityDialogInterface)}
        >
          {cityDialogInterface.toLowerCase()}
        </button>
      ))}
      <Dialog.Title className="flex w-full content-center text-2xl">
        {cityName}
      </Dialog.Title>
      <Dialog.Close className="focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground rounded-sm opacity-70 ring-offset-black transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none">
        <Icon id="x" />
        <span className="sr-only">Close</span>
      </Dialog.Close>
    </nav>
    {children}
  </DialogWrapper>
)

interface CityDialogInterfaceProps extends InterfaceProps {
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

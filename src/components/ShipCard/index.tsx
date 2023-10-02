import { type City } from "schema"
import {
  type CityDialogStoreActions,
  useCityDialogStore,
} from "~/state/cityDialogStore"
import {
  useGamestateStore,
  type ShipComposite,
  type GamestateStoreActions,
} from "~/state/gamestateStore"
import {
  LargeShipCard,
  type LargeShipCardProps,
} from "~/components/ShipCard/LargeShipCard"
import {
  SmallShipCard,
  type SmallShipCardProps,
} from "~/components/ShipCard/SmallShipCard"
import {
  TinyShipCard,
  type TinyShipCardProps,
} from "~/components/ShipCard/TinyCard"

const SHIP_CARD_TYPES = {
  SMALL: "SMALL",
  LARGE: "LARGE",
  TINY: "TINY",
}

export type ShipCardType = keyof typeof SHIP_CARD_TYPES

export interface CommonShipCardProps {
  ship: ShipComposite
  type: ShipCardType
}

export interface InnerCommonShipCardProps
  extends Omit<CommonShipCardProps, "type"> {
  isSelectedShip: boolean
  isSailing: boolean
  city?: City
  className?: string
  toggleShipSelection: GamestateStoreActions["toggleShipSelection"]
  shipTradeClick: CityDialogStoreActions["shipTradeClick"]
  shipExchangeClick: CityDialogStoreActions["shipExchangeClick"]
  toggleOpenState: CityDialogStoreActions["toggleOpenState"]
}

type ShipCardProps =
  | ({ type: "TINY" } & TinyShipCardProps & Omit<CommonShipCardProps, "type">)
  | ({ type: "SMALL" } & SmallShipCardProps & Omit<CommonShipCardProps, "type">)
  | ({ type: "LARGE" } & LargeShipCardProps & Omit<CommonShipCardProps, "type">)

// TODO: I sort of hate this... it needs to be broken up or something
export const ShipCard = ({ ship, type, ...rest }: ShipCardProps) => {
  const { sailingShips, selectedShip, toggleShipSelection } = useGamestateStore(
    (state) => ({
      sailingShips: state.sailingShips,
      selectedShip: state.selectedShip,
      // TODO: should i use useGamestateStore as a source of truth outside map, or react-query only?
      toggleShipSelection: state.toggleShipSelection,
    }),
  )

  const { toggleOpenState, shipTradeClick, shipExchangeClick } =
    useCityDialogStore((state) => ({
      toggleOpenState: state.toggleOpenState,
      shipTradeClick: state.shipTradeClick,
      shipExchangeClick: state.shipExchangeClick,
    }))

  const isSelectedShip = selectedShip?.id === ship.id

  const isSailing = sailingShips
    .map((currentShip) => currentShip.id)
    .includes(ship.id)

  // separate out these components to avoid re-renders
  const commonShipCardProps: InnerCommonShipCardProps = {
    ship,
    isSelectedShip,
    isSailing,
    toggleOpenState,
    toggleShipSelection,
    shipExchangeClick,
    shipTradeClick,
    ...rest,
  }

  switch (type) {
    case "SMALL": {
      return <SmallShipCard {...commonShipCardProps} />
    }
    case "TINY": {
      return (
        <TinyShipCard
          {...commonShipCardProps}
          onClick={(ship) => {
            shipTradeClick({
              newSelectedCityId: ship.cityId,
              newTradeShipId: ship.id,
            })
          }}
        />
      )
    }
    default:
    case "LARGE": {
      return <LargeShipCard {...commonShipCardProps} />
    }
  }
}

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
import { LargeShipCard } from "~/components/ShipCard/LargeShipCard"
import { SmallShipCard } from "~/components/ShipCard/SmallShipCard"
import { TinyShipCard } from "~/components/ShipCard/TinyCard"

const SHIP_CARD_TYPES = {
  SMALL: "SMALL",
  LARGE: "LARGE",
  TINY: "TINY",
}

export type ShipCardType = keyof typeof SHIP_CARD_TYPES

interface ShipCardProps {
  ship: ShipComposite
  type: ShipCardType
}

export interface CommonShipCardProps extends Omit<ShipCardProps, "type"> {
  isSelectedShip: boolean
  isSailing: boolean
  city?: City
  className?: string
  toggleShipSelection: GamestateStoreActions["toggleShipSelection"]
  shipTradeClick: CityDialogStoreActions["shipTradeClick"]
  shipExchangeClick: CityDialogStoreActions["shipExchangeClick"]
  toggleOpenState: CityDialogStoreActions["toggleOpenState"]
}

export const ShipCard = ({ ship, type }: ShipCardProps) => {
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

  const commonShipCardProps: CommonShipCardProps = {
    ship,
    isSelectedShip,
    isSailing,
    toggleOpenState,
    toggleShipSelection,
    shipExchangeClick,
    shipTradeClick,
  }

  switch (type) {
    case "SMALL": {
      return <SmallShipCard {...commonShipCardProps} />
    }
    case "TINY": {
      return <TinyShipCard {...commonShipCardProps} />
    }
    default:
    case "LARGE": {
      return <LargeShipCard {...commonShipCardProps} />
    }
  }
}

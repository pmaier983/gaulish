import { ExchangeButton } from "~/components/buttons/ExchangeButton"
import { ImageIcon } from "~/components/ImageIcon"
import { Tooltip } from "~/components/Tooltip"
import { TooltipEditText } from "~/components/TooltipTextEditor"
import { MAX_SHIP_NAME_LENGTH } from "~/components/constants"
import { useCityDialogStore } from "~/state/cityDialogStore"
import { useGamestateStore, type ShipComposite } from "~/state/gamestateStore"
import { api } from "~/utils/api"
import { TradeButton } from "~/components/buttons/TradeButton"
import { SailButton } from "~/components/buttons/SailButton"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"

const SHIP_CARD_TYPES = {
  SMALL: "SMALL",
  LARGE: "LARGE",
}

export type ShipCardType = keyof typeof SHIP_CARD_TYPES

interface ShipCardProps {
  ship: ShipComposite
  type: ShipCardType
}

export const ShipCard = ({ ship, type }: ShipCardProps) => {
  const queryClient = api.useContext()

  const { sailingShips, selectedShip, cityObject, toggleShipSelection } =
    useGamestateStore((state) => ({
      sailingShips: state.sailingShips,
      selectedShip: state.selectedShip,
      // TODO: should i use useGamestateStore as a source of truth outside map, or react-query only?
      cityObject: state.cityObject,
      toggleShipSelection: state.toggleShipSelection,
    }))

  const { setCityDialogStoreState } = useCityDialogStore((state) => ({
    setCityDialogStoreState: state.setCityDialogStoreState,
  }))

  const { mutate } = api.ships.updateShipName.useMutation({
    onSuccess: (newShipData) => {
      // when the ship name is updated update the ship list!
      queryClient.ships.getUsersShips.setData(undefined, (oldShipList) => {
        const newData = oldShipList?.map((currentShip) => {
          if (currentShip.id === newShipData.shipId) {
            return { ...currentShip, name: newShipData.newName }
          }
          return currentShip
        })
        return newData
      })
    },
  })

  const isSelectedShip = selectedShip?.id === ship.id

  const isSailing = sailingShips
    .map((currentShip) => currentShip.id)
    .includes(ship.id)

  const cityName = cityObject[ship.cityId]?.name

  switch (type) {
    case "SMALL": {
      return (
        <article
          className={`flex w-full max-w-[20rem] flex-col gap-2 rounded p-2 outline outline-1 outline-black ${
            isSelectedShip ? "outline-4 outline-red-600" : ""
          }`}
        >
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-row">
              <ImageIcon id={ship.shipType} />
              <div className="flex flex-col pl-2">
                <Tooltip
                  interactive
                  content={
                    <TooltipEditText
                      text={ship.name}
                      maxNewTextLength={MAX_SHIP_NAME_LENGTH}
                      onSubmit={(newName) => {
                        mutate({ shipId: ship.id, newName: newName })
                      }}
                    />
                  }
                >
                  {/* TODO: what proper html tag to use for prominence within articles? h4 or what */}
                  <span className="h-5 whitespace-nowrap text-xl leading-5">
                    {ship.name}
                  </span>
                </Tooltip>
                <div className="h-5 whitespace-nowrap leading-5">
                  {isSailing ? "Sailing" : cityName}
                </div>
              </div>
            </div>
            <SailButton
              onClick={() => toggleShipSelection(ship)}
              className=" justify-center"
              disabled={isSailing}
            />
          </div>
          <div className="flex flex-row items-center justify-between">
            <ImageIconCount id="GOLD" count={ship.gold} />
            <CargoCount
              currentCargo={ship.stone + ship.wheat + ship.wood + ship.wool}
              cargoCapacity={ship.cargoCapacity}
            />
            <ExchangeButton
              disabled={isSailing}
              onClick={() =>
                setCityDialogStoreState({
                  isOpen: true,
                  cityDialogInterface: "EXCHANGE",
                })
              }
            />
            <TradeButton
              onClick={() =>
                setCityDialogStoreState({
                  isOpen: true,
                  cityDialogInterface: "TRADE",
                })
              }
              disabled={isSailing}
            />
          </div>
        </article>
      )
    }
    default:
    case "LARGE": {
      return (
        // We need to use border here as the parent container hides outlines & box shadows (cuz it needs to scroll)
        <article className="flex min-h-[300px] min-w-[200px] rounded-md border border-black p-2">
          <div className="flex h-fit flex-row items-center gap-3">
            <ImageIcon id={ship.shipType} size="32" />
            <h3 className="overflow-hidden text-ellipsis whitespace-nowrap text-xl">
              {ship.name}
            </h3>
          </div>
        </article>
      )
    }
  }
}

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo, type ComponentProps, useState } from "react"
import type { City } from "schema"
import { FormatNumber } from "~/components/FormatNumber"
import { ImageIcon } from "~/components/ImageIcon"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { Tooltip } from "~/components/Tooltip"
import {
  SHIP_TYPE_TO_SHIP_PROPERTIES,
  type ShipProperties,
  type ShipType,
} from "~/components/constants"
import { useCityDialogStore } from "~/state/cityDialogStore"
import { api } from "~/utils/api"

const columnHelper = createColumnHelper<ShipProperties>()

interface DockyardTableProps extends ComponentProps<"table"> {
  totalGoldInSelectedCity: number
  selectedCity: City
}

export const DockyardTable = ({
  totalGoldInSelectedCity,
  className = "",
  selectedCity,
}: DockyardTableProps) => {
  const { setCityDialogInterface } = useCityDialogStore((state) => ({
    setCityDialogInterface: state.setCityDialogInterface,
  }))
  const queryClient = api.useContext()

  const { mutate: buyNewShip, isLoading } = api.ships.buyShip.useMutation({
    onSuccess: (newShips) => {
      queryClient.ships.getUsersShips.setData(undefined, () => {
        return newShips
      })
      setCityDialogInterface("SHIPS")
    },
    onError: () => {
      // If things fail, refresh everything to be safe!
      void queryClient.ships.getUsersShips.invalidate()
    },
  })

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        cell: (info) => {
          // TODO: any way to avoid using these declared types here?
          const shipType = info.row.getValue<ShipType>("shipType")
          const shipCost = info.row.getValue<number>("price")

          const shipPurchaseErrorText = (() => {
            if (shipCost > totalGoldInSelectedCity) {
              return `Not enough gold to purchase this ship.`
            }
            return false
          })()

          const isShipPurchaseDisabled = !!shipPurchaseErrorText

          return (
            <Tooltip
              content={shipPurchaseErrorText}
              disabled={!isShipPurchaseDisabled}
            >
              <div>
                <button
                  disabled={isShipPurchaseDisabled}
                  className="h-full rounded bg-green-400 p-2 outline outline-1 outline-black hover:bg-green-600 active:bg-green-800 active:text-white disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500 disabled:outline-slate-500"
                  onClick={() => {
                    buyNewShip({
                      shipType,
                      cityId: selectedCity.id,
                    })
                  }}
                >
                  Buy
                </button>
              </div>
            </Tooltip>
          )
        },
      }),
      columnHelper.accessor("shipType", {
        header: () => <>Ship Type</>,
        cell: (info) => <ImageIcon icon={info.getValue()} />,
      }),
      columnHelper.accessor("price", {
        header: () => <>Price</>,
        cell: (info) => <ImageIconCount icon="GOLD" count={info.getValue()} />,
      }),
      columnHelper.accessor("cargoCapacity", {
        header: () => <>Cargo Capacity</>,
        cell: (info) => (
          <CargoCount
            cargoCapacity={info.getValue()}
            currentCargo={0}
            className="w-fit"
          />
        ),
      }),
      columnHelper.accessor("speed", {
        header: () => <>Speed</>,
        cell: (info) => (
          <>
            <ImageIcon icon="SPEED" />
            <FormatNumber number={Math.round(info.getValue() * 1000000)} />
          </>
        ),
      }),
      columnHelper.accessor("attack", {
        header: () => <>Attack</>,
        cell: (info) => (
          <>
            <ImageIcon icon="ATTACK" />
            <FormatNumber number={info.getValue()} />
          </>
        ),
      }),
      columnHelper.accessor("defense", {
        header: () => <>Defense</>,
        cell: (info) => (
          <>
            <ImageIcon icon="DEFENSE" />
            <FormatNumber number={info.getValue()} />
          </>
        ),
      }),
    ],
    [buyNewShip, selectedCity, totalGoldInSelectedCity],
  )

  const table = useReactTable({
    data: Object.values(SHIP_TYPE_TO_SHIP_PROPERTIES),
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
  })

  const [state] = useState(table.initialState)

  table.setOptions((prev) => ({
    ...prev,
    state,
    onStateChange: () => {
      /**
       * TODO: fix this
       *
       * This is a MASSIVE hack to stop the table from a re-rendering in a loop
       *
       * currently when you are on the dockyard interface, and you change cities,
       * the table enters into a re-render cycle and kills the entire application
       * this is my band-aide for now...
       *
       * I think the issue is somewhere within getRowModel, but I haven't yet investigated
       */
    },
  }))

  return (
    <div className="relative flex flex-1 justify-center">
      <table className={`rounded outline outline-1 outline-black ${className}`}>
        <thead className="border-b-2 border-black">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="border-t-2 border-dashed border-black">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  <div className="flex flex-1 flex-row justify-start gap-2 pl-2 pr-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {isLoading && (
        <div className="absolute flex h-full w-full flex-1 items-center justify-center bg-black bg-opacity-80 text-2xl text-white">
          Setting up your new Ship!
        </div>
      )}
    </div>
  )
}

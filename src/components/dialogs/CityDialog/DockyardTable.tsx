import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useMemo, type ComponentProps } from "react"
import { FormatNumber } from "~/components/FormatNumber"
import { ImageIcon } from "~/components/ImageIcon"
import { CargoCount, ImageIconCount } from "~/components/ImageIconCount"
import { Tooltip } from "~/components/Tooltip"
import {
  SHIP_TYPE_TO_SHIP_PROPERTIES,
  type ShipProperties,
  type ShipType,
} from "~/components/constants"

const columnHelper = createColumnHelper<ShipProperties>()

interface DockyardTableProps extends ComponentProps<"table"> {
  totalGoldInSelectedCity: number
}

export const DockyardTable = ({
  totalGoldInSelectedCity,
  className = "",
}: DockyardTableProps) => {
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
                    console.log(shipType)
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
    [totalGoldInSelectedCity],
  )

  const table = useReactTable({
    data: Object.values(SHIP_TYPE_TO_SHIP_PROPERTIES),
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  return (
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
  )
}

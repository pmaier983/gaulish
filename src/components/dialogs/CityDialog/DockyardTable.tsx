import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { type ComponentProps } from "react"
import {
  SHIP_TYPE_TO_SHIP_PROPERTIES,
  type ShipProperties,
} from "~/components/constants"

const columnHelper = createColumnHelper<ShipProperties>()

const columns = [
  columnHelper.accessor("shipType", {}),
  columnHelper.accessor("price", {}),
  columnHelper.accessor("cargoCapacity", {}),
  columnHelper.accessor("speed", {}),
  columnHelper.accessor("attack", {}),
  columnHelper.accessor("defense", {}),
]

interface DockyardTableProps extends ComponentProps<"table"> {}

export const DockyardTable = ({ className }: DockyardTableProps) => {
  const table = useReactTable({
    data: Object.values(SHIP_TYPE_TO_SHIP_PROPERTIES),
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table className={className}>
      <thead>
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
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

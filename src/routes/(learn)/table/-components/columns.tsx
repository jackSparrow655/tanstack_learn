import { type ColumnDef } from '@tanstack/react-table'
import type { User } from './types'

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    filterFn: (row, columnId, filterValue) => {
      const v = row.getValue(columnId)
      if (v === undefined || v === null) return false
      return String(v)
        .toLowerCase()
        .includes(String(filterValue).toLowerCase().trim())
    },
    size:95
  },
  { accessorKey: 'name', header: 'Name', size:125 },
  { accessorKey: 'email', header: 'Email', size:180 },
  { accessorKey: 'role', header: 'Role', size:120 },
  { accessorKey: 'amount', header: 'Amount', size:120 },

  {
    accessorKey: 'description',
    header: 'Description',
    size:580,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        expandedRows: Record<string, boolean>
        setExpandedRows: React.Dispatch<
          React.SetStateAction<Record<string, boolean>>
        >
      }

      const id = row.id
      const isExpanded = meta.expandedRows[id] ?? false

      const text = row.original.description
      const preview = text.slice(0, 120)

      return (
        <div className="text-sm whitespace-pre-wrap">
          {isExpanded ? text : preview + (text.length > 120 ? '...' : '')}

          {text.length > 120 && (
            <button
              className="text-blue-600 underline ml-2"
              onClick={() =>
                meta.setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }))
              }
            >
              {isExpanded ? 'See less' : 'See more'}
            </button>
          )}
        </div>
      )
    },
  },
]

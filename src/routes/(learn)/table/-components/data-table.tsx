'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { useVirtualizer } from '@tanstack/react-virtual'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { columns } from './columns'
import { useDebounce } from '../-utils/useDebounce'
import { useEffect, useRef, useState } from 'react'
import DebounceedColumnFilter from './DebounceedColumnFilter'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  height?: number
}

export function DataTable<TData, TValue>({
  data,
  height = 20,
}: DataTableProps<TData, TValue>) {
  const [globalFilter, setGlobalFilter] = useState<string>('')
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [globalInputVal, setGlobalInputVal] = useState<string>('')
  //@ts-ignore
  const table = useReactTable({
    //@ts-ignore
    data,
    //@ts-ignore
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableColumnResizing: true,
    columnResizeMode: 'onEnd',
    globalFilterFn: 'includesString',
    meta: {
      expandedRows,
      setExpandedRows,
    },
  })
  // 🔥 Virtualizer for HUGE row counts
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const row = table.getRowModel().rows[index]
      return expandedRows[row.id] ? 200 : 42 // estimate expanded height
    },
    overscan: 10,
    measureElement:
      typeof window !== 'undefined' && ResizeObserver
        ? (el) => el.getBoundingClientRect().height
        : undefined,
  })

  const debounceValForGlobalFilter = useDebounce(globalInputVal)

  useEffect(() => {
    setGlobalFilter(debounceValForGlobalFilter)
  }, [debounceValForGlobalFilter])
  return (
    <div className="space-y-4">
      {/* GLOBAL SEARCH */}
      <Input
        placeholder="Search all columns..."
        value={globalInputVal}
        onChange={(e) => setGlobalInputVal(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          {/* HEADER */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="flex h-20">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                    className="flex flex-col justify-center w-full h-full items-center px-0.5"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}

                    {/* COLUMN SEARCH */}
                    {header.column.getCanFilter() && (
                      <DebounceedColumnFilter column={header.column} />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
        </Table>

        {/* BODY (virtualized rows) */}
        <div
          ref={parentRef}
          style={{ height }}
          className="overflow-auto h-full max-h-[400px]"
        >
          <Table>
            <TableBody
              style={{
                height: rowVirtualizer.getTotalSize(),
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = table.getRowModel().rows[virtualRow.index]
                // const id = row.id

                return (
                  <TableRow
                    ref={rowVirtualizer.measureElement}
                    key={row.id}
                    data-index={virtualRow.index}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        style={{ width: cell.column.getSize() }}
                        key={cell.id}
                      >
                        {flexRender(cell.column.columnDef.cell, {
                          ...cell.getContext(),
                          expandedRows,
                          setExpandedRows,
                        })}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}

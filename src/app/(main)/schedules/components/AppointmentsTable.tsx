"use client"

import * as React from "react"
import { flexRender, getCoreRowModel, useReactTable, getFilteredRowModel, getSortedRowModel, getPaginationRowModel, type SortingState, type ColumnFiltersState } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card" // ✅ Importa o Card
import { columns } from "./columns"
import type { FormattedAppointment } from "@/lib/types";
import { cn } from "@/lib/utils"

interface AppointmentsTableProps {
  data: FormattedAppointment[]
}

export function AppointmentsTable({ data }: AppointmentsTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    // ✅ O contêiner principal agora é um Card com o estilo do tema
    <Card className="rounded-xl shadow-subtle">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center">
          <Input
            placeholder="Filtrar por nome do cliente..."
            value={(table.getColumn("clientName")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("clientName")?.setFilterValue(event.target.value)}
            className="max-w-sm glass-input" // ✅ Estilo de vidro para o input
          />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-brand-text">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  // ✅ APLICA A COR DE LINHA ALTERNADA
                  <TableRow key={row.id} className={cn(index % 2 !== 0 && 'bg-table-row-stripe')}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-brand-text-secondary">
                    Nenhum agendamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex items-center justify-between space-x-2 pt-2">
          <div className="flex-1 text-sm text-brand-text-secondary">
              {table.getFilteredRowModel().rows.length} agendamento(s) encontrado(s).
          </div>
          <div className="flex items-center space-x-2">
              <span className="text-sm text-brand-text-secondary">
                  Página{' '}
                  {table.getState().pagination.pageIndex + 1} de{' '}
                  {table.getPageCount()}
              </span>
              <Button
                variant="outline" size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Anterior
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Próximo
              </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
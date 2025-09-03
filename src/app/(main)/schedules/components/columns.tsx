"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { deleteAppointment } from "@/lib/actions/appointment.actions"
import { toast } from "sonner"
import { EditAppointmentDialog } from "./EditAppointmentDialog"
import type { FormattedAppointment } from "@/lib/types"

function CellActions({ appointment }: { appointment: FormattedAppointment }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);

  const handleDelete = async () => {
    toast.promise(deleteAppointment(appointment.id), {
      loading: 'Cancelando agendamento...',
      success: (result) => {
        if (result?.success) {
          // Idealmente, chamar uma função para recarregar a tabela aqui
          return result.message || "Agendamento cancelado.";
        }
        throw new Error(result?.error || "Ocorreu uma falha.");
      },
      error: (err: Error) => err.message || "Ocorreu um erro."
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        {/* ✅ CORREÇÃO: Aplica o tema do card ao menu dropdown */}
        <DropdownMenuContent align="end" className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            Reagendar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAppointmentDialog
        appointment={appointment}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
        <AlertDialogContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription className="text-brand-text-secondary">
              O agendamento para {appointment.clientName} será permanentemente cancelado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const columns: ColumnDef<FormattedAppointment>[] = [
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Cliente
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "serviceName",
    header: "Serviço",
  },
  {
    accessorKey: "staffName",
    header: "Funcionário",
  },
  {
    accessorKey: "startTime",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Horário
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(row.getValue("startTime"))),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions appointment={row.original} />,
  },
]

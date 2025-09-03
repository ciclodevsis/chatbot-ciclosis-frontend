"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { deleteService } from "@/lib/actions/service.actions"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { ServiceDialog } from "./ServiceDialog"
import { toast } from "sonner"
import type { Service } from "@/lib/types"

const ServiceActionsCell = ({ service }: { service: Service }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);

  const handleDelete = async () => {
    const result = await deleteService(service.id);
    if (result?.success) {
      toast.success("Sucesso!", { description: result.message });
    } else {
      toast.error("Erro!", { description: result?.error || result?.message });
    }
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
        <DropdownMenuContent align="end" className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsRemoveAlertOpen(true)} className="text-destructive focus:text-destructive">
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ServiceDialog service={service} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

      <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
        <AlertDialogContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              {`Esta ação não pode ser desfeita. Isso irá excluir permanentemente o serviço "${service.name}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Confirmar Exclusão
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export const columns: ColumnDef<Service>[] = [
  { accessorKey: "name", header: "Nome do Serviço" },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(price)
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "duration_minutes",
    header: "Duração",
    cell: ({ row }) => <div>{`${row.getValue("duration_minutes")} min`}</div>,
  },
  { id: "actions", cell: ({ row }) => <ServiceActionsCell service={row.original} /> },
]
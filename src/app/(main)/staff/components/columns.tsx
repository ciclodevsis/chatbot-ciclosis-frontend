// CAMINHO: app/(main)/staff/components/columns.tsx

"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { removeStaffMember } from "@/lib/actions/staff.actions"
import { toast } from "sonner"
import { EditStaffDialog } from "./EditStaffDialog"
import type { StaffMember } from "@/lib/types"

// ✅ MELHORIA: A célula de ações agora é um componente separado para melhor gerenciamento de estado.
function CellActions({ staffMember }: { staffMember: StaffMember }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);

  const handleRemove = async () => {
    const result = await removeStaffMember(staffMember.id);
    if (result) {
      if (result.success) {
        toast.success("Sucesso!", { description: result.success });
      } else {
        toast.error("Erro!", { description: result.error });
      }
    } else {
      // Caso de erro inesperado (a action retornou null)
      toast.error("Erro Inesperado!", { description: "Não foi possível remover o funcionário. Tente novamente." });
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
            Editar Função
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => setIsRemoveAlertOpen(true)}
          >
            Remover
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditStaffDialog
        staffMember={staffMember}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
      
      <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
        <AlertDialogContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza que deseja remover?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação removerá permanentemente o usuário {staffMember.full_name} da sua equipe e do sistema. Ele perderá o acesso imediatamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemove} className="bg-destructive hover:bg-destructive/90">Confirmar Remoção</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}


export const columns: ColumnDef<StaffMember>[] = [
  {
    accessorKey: "full_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "role",
    header: "Função",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions staffMember={row.original} />,
  },
]
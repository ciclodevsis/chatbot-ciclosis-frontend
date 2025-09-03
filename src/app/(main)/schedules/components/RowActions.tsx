// CAMINHO: app/(main)/schedules/components/RowActions.tsx

"use client"

import { useState } from "react"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { deleteAppointment } from "@/lib/actions/appointment.actions"
import { toast } from "sonner"
import { EditAppointmentDialog } from "./EditAppointmentDialog"
import type { FormattedAppointment } from "@/lib/types"

interface RowActionsProps {
  appointment: FormattedAppointment
}

export function RowActions({ appointment }: RowActionsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);

  // A ação de cancelar agora é mais robusta
  const handleCancel = async () => {
    // Garante que temos um ID antes de prosseguir
    if (!appointment.id) {
      toast.error("Erro!", { description: "ID do agendamento não encontrado." });
      return;
    }

    const result = await deleteAppointment(appointment.id);

    // ✅ CORREÇÃO: Verifica se o resultado não é nulo antes de usá-lo
    if (result) {
      // ✅ MELHORIA: Usa a propriedade 'success' para determinar o tipo de toast
      if (result.success) {
        toast.success("Sucesso!", { description: result.message });
        // Idealmente, você chamaria uma função aqui para recarregar os dados da tabela
        // ex: onAppointmentDeleted?.();
      } else {
        // Usa a mensagem de erro se existir, senão a mensagem padrão
        toast.error("Erro!", { description: result.error || result.message });
      }
    } else {
      // Caso algo muito inesperado aconteça e o resultado seja nulo
      toast.error("Erro!", { description: "Ocorreu uma falha inesperada." });
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Ações</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setIsEditDialogOpen(true)}>
            Reagendar
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onSelect={() => setIsCancelAlertOpen(true)}
          >
            Cancelar agendamento
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditAppointmentDialog 
        appointment={appointment} 
        open={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              O agendamento para {appointment.clientName} será permanentemente cancelado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleCancel}
            >
              Confirmar Cancelamento
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
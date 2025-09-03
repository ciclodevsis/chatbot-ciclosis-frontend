"use client"

import { useEffect } from "react";
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateStaffRole } from "@/lib/actions/staff.actions";
import { toast } from "sonner";
import type { StaffMember } from "@/lib/types";
import type { FormState } from "@/lib/actions/types";

interface EditStaffDialogProps {
  staffMember: StaffMember;
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditStaffDialog({ staffMember, children, open, onOpenChange }: EditStaffDialogProps) {
  const initialState: FormState = null;
  const [state, formAction] = useFormState(updateStaffRole, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success("Sucesso!", { description: state.message });
      onOpenChange(false);
    } else if (state?.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
        <DialogHeader>
          <DialogTitle>Editar Função</DialogTitle>
          <DialogDescription className="text-brand-text-secondary">Altere a função de {staffMember.full_name} no sistema.</DialogDescription>
        </DialogHeader>
        <form action={formAction}>
          <input type="hidden" name="userId" value={staffMember.id} />
          <div className="py-4">
            <Select name="newRole" defaultValue={staffMember.role || 'staff'}>
              <SelectTrigger className="glass-input">
                <SelectValue placeholder="Selecione uma função" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="staff">Funcionário (Staff)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-brand-accent hover:bg-brand-accent-hover text-white">Salvar Alterações</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
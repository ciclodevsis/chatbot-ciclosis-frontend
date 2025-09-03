"use client"

import { useState, useEffect } from "react"
import { useFormState } from "react-dom";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveService } from "@/lib/actions/service.actions"
import { toast } from "sonner";
import type { Service } from "@/lib/types"
import type { FormState } from "@/lib/actions/types";

type ServiceDialogProps = { service?: Service; children?: React.ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void; };

function ServiceForm({ service, onFormSuccess }: { service?: Service, onFormSuccess: () => void }) {
  const initialState: FormState = null;
  const [state, formAction] = useFormState(saveService, initialState);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Sucesso!", { description: state.message });
      onFormSuccess();
    } else if (state.error) {
      toast.error("Erro!", { description: state.error });
    } else if (state.errors) {
      const firstError = Object.values(state.errors).find(err => err)?.[0];
      if (firstError) { toast.error("Erro de Validação", { description: firstError }); }
    }
  }, [state, onFormSuccess]);
  
  return (
    <form action={formAction} className="grid gap-4 py-4">
      {service?.id && <input type="hidden" name="id" value={service.id} />}
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Nome</Label>
        <Input id="name" name="name" defaultValue={service?.name} className="col-span-3 glass-input" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="price" className="text-right">Preço (R$)</Label>
        <Input id="price" name="price" type="number" step="0.01" defaultValue={service?.price} className="col-span-3 glass-input" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="duration_minutes" className="text-right">Duração (min)</Label>
        <Input id="duration_minutes" name="duration_minutes" type="number" defaultValue={service?.duration_minutes} className="col-span-3 glass-input" />
      </div>
      <DialogFooter>
        <Button type="submit" className="bg-brand-accent hover:bg-brand-accent-hover text-white">Salvar</Button>
      </DialogFooter>
    </form>
  )
}

export function ServiceDialog({ service, children, open: controlledOpen, onOpenChange }: ServiceDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
        <DialogHeader>
          <DialogTitle>{service ? "Editar Serviço" : "Adicionar Novo Serviço"}</DialogTitle>
          <DialogDescription className="text-brand-text-secondary">
            Preencha os detalhes do serviço. Clique em salvar para confirmar.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm service={service} onFormSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
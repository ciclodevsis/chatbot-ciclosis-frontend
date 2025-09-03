"use client"

import { useFormState } from "react-dom";
import { useEffect, useState, useRef } from "react";
import { inviteStaffMember } from "@/lib/actions/staff.actions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { FormState } from "@/lib/actions/types";

export function InviteStaffDialog({ tenantId }: { tenantId: string }) {
  const [open, setOpen] = useState(false);
  const initialState: FormState = null;
  const [state, formAction] = useFormState(inviteStaffMember, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Convite Enviado!", { description: state.message });
      formRef.current?.reset();
      const timer = setTimeout(() => setOpen(false), 2000);
      return () => clearTimeout(timer);
    } else if (state?.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-accent hover:bg-brand-accent-hover text-white">+ Convidar Funcionário</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-card-border text-brand-text rounded-xl shadow-subtle">
        <DialogHeader>
          <DialogTitle>Convidar Novo Membro</DialogTitle>
          <DialogDescription className="text-brand-text-secondary">
            Digite o e-mail do funcionário que você deseja convidar.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4">
          <input type="hidden" name="tenantId" value={tenantId} />
          <div className="grid flex-1 gap-2">
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input id="email" name="email" type="email" placeholder="nome@empresa.com" required className="glass-input"/>
          </div>
          <DialogFooter className="sm:justify-start">
            <Button type="submit" className="bg-brand-accent hover:bg-brand-accent-hover text-white">Enviar Convite</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
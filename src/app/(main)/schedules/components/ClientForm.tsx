// CAMINHO: app/(main)/schedules/components/ClientForm.tsx

"use client"

import { useFormState } from "react-dom"
import { useTransition, useEffect } from "react"
import { createAppointment } from "@/lib/actions/appointment.actions"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { FormState } from "@/lib/actions/types"

type ClientFormProps = {
  serviceId: string;
  staffId: string;
  selectedDate: Date;
  selectedSlot: string;
  onSuccess: () => void;
};

export function ClientForm({ serviceId, staffId, selectedDate, selectedSlot, onSuccess }: ClientFormProps) {
  const [state, formAction] = useFormState(createAppointment, null as FormState);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (state?.success) {
      toast.success("Sucesso!", { description: state.message });
      onSuccess();
    } else if (state?.error) {
      toast.error("Erro", { description: state.error });
    }
  }, [state, onSuccess]);

  return (
    <form action={(formData) => startTransition(() => formAction(formData))} className="space-y-4">
      <input type="hidden" name="serviceId" value={serviceId} />
      <input type="hidden" name="staffId" value={staffId} />
      <input type="hidden" name="selectedDate" value={selectedDate.toISOString()} />
      <input type="hidden" name="selectedSlot" value={selectedSlot} />

      <div className="space-y-2">
        <Label htmlFor="clientName">Nome do Cliente</Label>
        <Input id="clientName" name="clientName" placeholder="Nome completo" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="clientCpf">CPF do Cliente</Label>
        <Input id="clientCpf" name="clientCpf" placeholder="000.000.000-00" required />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Confirmando..." : "Confirmar Agendamento"}
        </Button>
      </div>
    </form>
  )
}
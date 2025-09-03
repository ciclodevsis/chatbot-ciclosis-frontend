"use client"

import { useFormState } from "react-dom";
import { useEffect } from "react";
import { updateStaffServices } from "@/lib/actions/staff.actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { FormState } from "@/lib/actions/types";
import type { ServiceWithEnabledStatus } from "@/lib/types";

type StaffServicesFormProps = {
  services: ServiceWithEnabledStatus[];
};

export function StaffServicesForm({ services }: StaffServicesFormProps) {
  const initialState: FormState = null;
  const [state, formAction] = useFormState(updateStaffServices, initialState);

  useEffect(() => {
    if (state?.success) {
      toast.success("Sucesso!", { description: state.message });
    } else if (state?.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Serviços</CardTitle>
        <CardDescription>Habilite ou desabilite os serviços que você oferece.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <Label htmlFor={service.id} className="text-base">{service.name}</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(service.price))} - {service.duration_minutes} min
                  </p>
                </div>
                <Switch
                  id={service.id}
                  name={service.id} // O 'name' é usado para o FormData
                  defaultChecked={service.isEnabled}
                />
              </div>
            ))}
          </div>
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  );
}
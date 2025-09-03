"use client"

import { useFormState } from "react-dom"
import { useEffect } from "react"
import { updateUserProfile } from "@/lib/actions/auth.actions"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { FormState } from "@/lib/actions/types"

type ProfileFormProps = {
  email: string;
  fullName: string;
};

export function ProfileForm({ email, fullName }: ProfileFormProps) {
  const initialState: FormState = null;
  const [state, formAction] = useFormState(updateUserProfile, initialState);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Sucesso!", { description: state.message });
    } else if (state.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Gerencie suas informações pessoais.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} disabled />
            <p className="text-xs text-muted-foreground">O e-mail não pode ser alterado.</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Nome Completo</Label>
            <Input id="fullName" name="fullName" defaultValue={fullName} />
          </div>
          <Button type="submit">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  );
}
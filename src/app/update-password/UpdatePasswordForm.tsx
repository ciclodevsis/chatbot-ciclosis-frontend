// Caminho: app/update-password/UpdatePasswordForm.tsx
"use client"
// Este formulário é quase idêntico ao de 'accept-invite'
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export function UpdatePasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    
    if (error) {
      toast.error("Erro", { description: "Não foi possível atualizar sua senha. O link pode ter expirado." });
    } else {
      toast.success("Sucesso!", { description: "Sua senha foi alterada. Redirecionando para o login..." });
      setTimeout(() => router.push('/login'), 2000);
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password">Nova Senha</Label>
        <Input id="password" name="password" type="password" required onChange={(e) => setPassword(e.target.value)} />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Salvando..." : "Salvar nova senha"}
      </Button>
    </form>
  )
}
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function AcceptInviteForm() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Este estado controla se a sessão do convite já foi validada e carregada
  const [isSessionReady, setIsSessionReady] = useState(false);

  // Este useEffect é a chave: ele roda uma vez quando a página carrega.
  useEffect(() => {
    // A Supabase coloca os tokens no "hash" da URL após o #
    const hash = window.location.hash;
    if (!hash) return;

    const params = new URLSearchParams(hash.substring(1));
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');

    // Se encontramos os tokens, definimos a sessão no cliente Supabase
    if (accessToken && refreshToken) {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      }).then(({ error }) => {
        if (error) {
          toast.error("Erro ao validar convite", { description: error.message });
          router.push('/login');
        } else {
          // A sessão está pronta, podemos mostrar o formulário de senha.
          setIsSessionReady(true);
        }
      });
    }
  }, [supabase.auth, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password.length < 6) {
      toast.error("Senha muito curta", { description: "A senha deve ter pelo menos 6 caracteres." });
      return;
    }
    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return;
    }

    setIsLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error("Erro ao definir a senha", { description: error.message });
    } else {
      toast.success("Sucesso!", { description: "Sua conta foi ativada. Redirecionando para o login..." });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
    setIsLoading(false);
  };

  // Enquanto a sessão não estiver pronta, mostramos uma mensagem de carregamento.
  if (!isSessionReady) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Verificando seu convite...</p>
        </div>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Bem-vindo(a) à Equipe!</CardTitle>
        <CardDescription>Defina uma senha para finalizar seu cadastro e acessar sua conta.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="password">Nova Senha</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirmar Senha</Label>
            <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Definir Senha e Acessar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
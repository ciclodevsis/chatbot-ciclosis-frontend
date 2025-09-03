"use client";

import Link from "next/link";
import { useFormState } from "react-dom";
import { signIn } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GlassCard } from "@/components/ui/glass-card";
import { GoogleIcon } from "./_components/GoogleIcon";
import { createClient } from "@/utils/supabase/client";

export function LoginClient() {
  const supabase = createClient();
  const [state, formAction] = useFormState(signIn, null);

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  };

  return (
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-text">Bem-vindo de volta</h1>
        <p className="text-brand-text/70">Faça login para acessar sua plataforma.</p>
      </div>
      
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-brand-text/80">E-mail</Label>
          <Input id="email" name="email" type="email" placeholder="nome@exemplo.com" required className="glass-input" />
        </div>
        <div className="space-y-2">
          <div className="flex items-center">
            <Label htmlFor="password" className="text-brand-text/80">Senha</Label>
            <Link href="/reset-password" className="ml-auto inline-block text-sm text-brand-accent hover:underline">
              Esqueceu sua senha?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required className="glass-input" />
        </div>
        {state?.error && <p className="text-sm text-status-error">{state.error}</p>}
        <Button type="submit" className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold">
          Fazer Login
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-glass-border" /></div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-brand-bg/80 px-2 text-brand-text/60 backdrop-blur-sm">Ou continue com</span>
        </div>
      </div>

      <Button variant="outline" type="button" className="w-full bg-white/50 border-glass-border backdrop-blur-sm hover:bg-white/70 text-brand-text" onClick={handleGoogleLogin}>
        <GoogleIcon className="mr-2 h-5 w-5" />
        Fazer login com o Google
      </Button>
      <div className="mt-6 text-center text-sm text-brand-text/80">
        Não tem uma conta?{" "}
        <Link href="/sign-up" className="font-semibold text-brand-accent hover:underline">
          Criar uma conta
        </Link>
      </div>
    </GlassCard>
  );
}
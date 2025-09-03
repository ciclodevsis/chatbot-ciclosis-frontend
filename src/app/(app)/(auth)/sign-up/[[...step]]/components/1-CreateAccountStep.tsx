// CAMINHO: app/(auth)/sign-up/[[...step]]/components/1-CreateAccountStep.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useSignUpContext } from "../SignUpContext";
import { createClient } from "@/utils/supabase/client";
import { CreateAccountSchema } from "@/lib/validators"; 

// Componentes UI e Ícones
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import 'react-phone-number-input/style.css';
import { toast } from "@/hooks/use-toast";

type CreateAccountStepProps = {
  onNextStep: () => void;
};

export function CreateAccountStep({ onNextStep }: CreateAccountStepProps) {
  const { formData, setFormData } = useSignUpContext();
  const [password, setPassword] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    const validationResult = CreateAccountSchema.safeParse({
      email: formData.email,
      confirmEmail,
      phone: formData.phone,
      password,
      agreed,
    });

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0].message;
      setError(firstError);
      return;
    }

    if (!isValidPhoneNumber(formData.phone || '')) {
      setError("O número de celular é inválido.");
      return;
    }

    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/sign-up/step-2`;
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          data: { phone: formData.phone },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          setError("Este e-mail já está cadastrado. Tente fazer login.");
        } else {
          setError(signUpError.message);
        }
        return;
      }

      if (data.user?.identities?.length === 0) {
        setError("Este usuário já existe, mas não foi confirmado. Verifique seu e-mail.");
        return;
      }
      onNextStep();
    } catch (error: unknown) {
      let message = "Ocorreu um erro desconhecido.";
      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: message,
    });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-bold tracking-tight">Crie sua conta</CardTitle>
        <CardDescription>É rápido e fácil. Preencha os campos abaixo.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="grid gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="grid gap-2">
                <Label htmlFor="email">Seu e-mail pessoal*</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(p => ({...p, email: e.target.value}))} required disabled={isLoading} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="confirm-email">Confirme seu e-mail*</Label>
                <Input id="confirm-email" type="email" value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} required disabled={isLoading} />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Seu celular*</Label>
            <PhoneInput id="phone" international defaultCountry="BR" value={formData.phone} onChange={(value) => setFormData(p => ({...p, phone: value}))} className="flex h-10 w-full rounded-md border border-input px-3 py-2 text-sm" disabled={isLoading}/>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Crie uma senha forte*</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} />
          </div>
          
          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <div className="items-top flex space-x-2 pt-2">
            <Checkbox id="terms" checked={agreed} onCheckedChange={(checked) => setAgreed(checked === true)} disabled={isLoading} />
            <div className="grid gap-1.5 leading-none">
                <label htmlFor="terms" className="text-sm font-medium">Concordar com os termos e políticas</label>
                <p className="text-xs text-muted-foreground">Ao continuar, você concorda com nossos <Link href="/legal/termos-de-uso" className="underline">Termos</Link> e <Link href="/legal/politica-de-privacidade" className="underline">Privacidade</Link>.</p>
            </div>
          </div>

          {/* --- RECAPTCHA INATIVO --- Lógica do !captchaToken removida do botão */}
          <Button type="submit" className="w-full" disabled={isLoading || !agreed}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Criar Conta e Continuar"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-center text-sm">
          Já tem uma conta?{" "}
          <Link href="/login" className="underline">Fazer login</Link>
        </div>
      </CardFooter>
    </Card>
  );
}
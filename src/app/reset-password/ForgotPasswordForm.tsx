"use client";

import { useFormState } from "react-dom";
import { useEffect, useRef } from "react";
import { forgotPassword } from "@/lib/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import type { FormState } from "@/lib/actions/types";

export function ForgotPasswordForm() {
  const initialState: FormState = null;
  const [state, formAction] = useFormState(forgotPassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!state) return;
    
    if (state.success) {
      toast.info("Verifique seu e-mail", { description: state.message });
      formRef.current?.reset();
    } 
    else if (state.error) {
      toast.error("Erro", { description: state.error });
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-brand-text/80">E-mail</Label>
        <Input 
          id="email" 
          name="email" 
          type="email" 
          placeholder="nome@exemplo.com" 
          required 
          className="glass-input" // ✅ Estilo do tema aplicado
        />
      </div>
      <Button 
        type="submit" 
        className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white font-semibold" // ✅ Estilo do tema aplicado
      >
        Enviar link de recuperação
      </Button>
    </form>
  );
}
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { GlassCard } from "@/components/ui/glass-card"; // ✅ Alterado para GlassCard

export default function ResetPasswordPage() {
  return (
    // ✅ Usa o GlassCard para manter a consistência visual com a página de login
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-text">Esqueceu sua senha?</h1>
        <p className="text-brand-text/70 mt-2">
          Sem problemas. Digite seu e-mail abaixo e enviaremos um link para você criar uma nova senha.
        </p>
      </div>
      
      <ForgotPasswordForm />
      
      <div className="mt-6 text-center text-sm text-brand-text/80">
        Lembrou a senha?{" "}
        <Link href="/login" className="font-semibold text-brand-accent hover:underline">
          Fazer login
        </Link>
      </div>
    </GlassCard>
  );
}
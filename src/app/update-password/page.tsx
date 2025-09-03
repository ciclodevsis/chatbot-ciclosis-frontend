import { GlassCard } from "@/components/ui/glass-card"; // ✅ Alterado para GlassCard
import { UpdatePasswordForm } from "./UpdatePasswordForm";

export default function UpdatePasswordPage() {
  return (
    // ✅ Layout alinhado com as outras páginas de autenticação
    <GlassCard className="w-full max-w-md p-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-brand-text">Crie uma nova senha</h1>
        <p className="text-brand-text/70 mt-2">
          Digite sua nova senha abaixo. Ela deve ter pelo menos 6 caracteres.
        </p>
      </div>
      <UpdatePasswordForm />
    </GlassCard>
  );
}
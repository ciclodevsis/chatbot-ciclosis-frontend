import { redirect } from "next/navigation";
import { getUserSession } from "@/lib/session";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { details } = await getUserSession();

  // Se a assinatura já está ativa, não há motivo para o usuário
  // estar em nenhuma página de /auth (login, cadastro, etc).
  if (details?.isSubscriptionActive) {
    return redirect('/dashboard');
  }

  // Se a assinatura não estiver ativa, permite que o usuário veja as páginas.
  return (
    <div className="relative min-h-screen w-full bg-brand-bg text-brand-text">
      <div 
        className="aurora-bg"
        style={{
          backgroundImage: `radial-gradient(circle at 100% 0%, rgba(0, 122, 255, 0.12), transparent 40%),
                            radial-gradient(circle at 0% 100%, rgba(0, 122, 255, 0.15), transparent 40%)`,
          backgroundSize: '300% 300%',
        }}
      />
      <main className="flex min-h-screen w-full items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
}
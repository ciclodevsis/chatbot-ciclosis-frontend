import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Sidebar } from './components/Sidebar';
import { getUserSession } from "@/lib/session";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, details } = await getUserSession();

  // 1. Se não há usuário, a proteção básica redireciona para o login.
  if (!user || !details) {
    return redirect('/login');
  }

  // 2. Se a assinatura não está ativa, tomamos uma decisão.
  if (!details.isSubscriptionActive) {
    const pathname = headers().get('next-url') || '';
    
    // Se ele NÃO está na página de finalização, nós o redirecionamos para o lugar certo.
    if (!pathname.startsWith('/finish-payment')) {
      if (details.subscription?.status === 'pending_payment') {
        return redirect('/finish-payment');
      } else {
        // Para todos os outros casos (trial expirado, cancelado, etc.)
        return redirect('/sign-up/step-2');
      }
    }
    // Se ele JÁ está em /finish-payment, não fazemos nada e deixamos a página carregar.
  }

  // 3. Se tudo estiver certo, renderiza a aplicação.
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
      <Sidebar user={user} />
      <div className="ml-64">
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
import { redirect } from "next/navigation";
import { getPendingSubscription } from "@/lib/actions/payment.actions";
import { FinishPaymentClient } from "./components/FinishPaymentClient";

export default async function FinishPaymentPage() {
  // Busca a assinatura pendente no servidor
  const pendingSubscription = await getPendingSubscription();

  // Se não houver assinatura pendente, o usuário não deveria estar aqui.
  // Redireciona para o dashboard.
  if (!pendingSubscription) {
    redirect('/dashboard');
  }

  return (
    <FinishPaymentClient 
      subscriptionId={pendingSubscription.subscriptionId} 
      planName={pendingSubscription.planName}
    />
  );
}
"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createCustomerPortalAction } from "@/lib/actions/billing.actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
// ✅ A importação do tipo Subscription agora funciona corretamente.
import type { Subscription } from "@/lib/types";

type BillingClientProps = {
  subscription: Subscription | null;
};

export function BillingClient({ subscription }: BillingClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleManageSubscription = () => {
    startTransition(async () => {
      const result = await createCustomerPortalAction();
      if (result.url) {
        window.location.href = result.url;
      } else {
        toast.error("Erro", {
          description: result.error || "Não foi possível abrir o portal de gerenciamento.",
        });
      }
    });
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-brand-text">Assinatura</h1>
        <p className="text-brand-text-secondary">
          Gerencie seu plano, métodos de pagamento e histórico de faturamento.
        </p>
      </div>

      <Card className="rounded-xl shadow-subtle">
        <CardHeader>
          <CardTitle>Seu Plano Atual</CardTitle>
          {!subscription ? (
            <CardDescription>Você não possui uma assinatura ativa.</CardDescription>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {subscription ? (
            <>
              <div className="p-4 border rounded-lg bg-secondary">
                <p className="font-semibold capitalize text-brand-text">{subscription.plan_id}</p>
                <p className="text-sm text-brand-text-secondary">
                  Sua assinatura está <span className="font-medium text-primary capitalize">{subscription.status}</span>.
                </p>
                <p className="text-sm text-brand-text-secondary">
                  {subscription.status === 'trialing' ? 'Seu período de teste termina em:' : 'Próxima cobrança em:'} {new Date(subscription.current_period_end).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <Button onClick={handleManageSubscription} disabled={isPending} className="bg-brand-accent hover:bg-brand-accent-hover text-white">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerenciar Assinatura e Faturamento
              </Button>
              <p className="text-xs text-brand-text-secondary">
                Você será redirecionado para o portal seguro do Mercado Pago para gerenciar seu plano,
                métodos de pagamento e ver seu histórico de faturas.
              </p>
            </>
          ) : (
            <p className="text-sm text-brand-text-secondary">
              Por favor, contate o suporte para ativar uma assinatura.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
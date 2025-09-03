"use client";

import { useSignUpContext } from "../SignUpContext";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Check, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Subscription } from "@/lib/types";

type PlanSelectionStepProps = {
  onPlanSelected: (planId: string) => void;
  existingSubscription: Subscription | null; // ✅ A prop que recebe os dados da assinatura
};

export function PlanSelectionStep({ onPlanSelected, existingSubscription }: PlanSelectionStepProps) {
    const { formData, setFormData } = useSignUpContext();
  
    const plans = [
        { id: "free", name: "Free", description: "Para começar a explorar a plataforma.", features: ["1 Administrador", "1 Profissional (staff)", "Validade de 30 dias"], badge: "Comece aqui", locked: false },
        { id: "standard", name: "Standard", description: "Ideal para profissionais autônomos e pequenas equipes.", features: [ "1 Administrador", "2 Profissionais (staff)", "Integração com Google Agenda", "Integração com WhatsApp", "Limite de 2.000 conversas/mês", ], badge: "Mais Popular", locked: false },
        { id: "pro", name: "Pro", description: "Para negócios em crescimento.", features: ["Tudo do Standard, e mais...", "Limite de 5.000 conversas/mês"], locked: true },
        { id: "business", name: "Business+", description: "Recursos avançados de automação.", features: ["Tudo do Pro, e mais...", "Recursos de IA com DialogFlow"], locked: true },
    ];
  
    const handleSelectPlan = (planId: string) => {
      setFormData((prev) => ({ ...prev, selectedPlan: planId }));
      onPlanSelected(planId);
    };
    
    // ✅ NOVA LÓGICA: Verifica se o botão do plano 'free' deve ser desabilitado.
    // Isso acontece se já existe uma assinatura (seja 'trialing', 'canceled', etc.)
    const isFreePlanDisabled = !!existingSubscription;
  
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-brand-text">Escolha o plano perfeito para você</h1>
            <p className="text-lg text-brand-text/70 mt-2">Você pode mudar de plano a qualquer momento.</p>
        </div>
        <div className="flex justify-center items-center gap-4 mb-8">
            <Label htmlFor="billing-cycle" className="font-medium">Mensal</Label>
            <Switch id="billing-cycle" checked={formData.billingCycle === 'annual'} onCheckedChange={(checked) => setFormData(prev => ({...prev, billingCycle: checked ? 'annual' : 'monthly'}))} />
            <Label htmlFor="billing-cycle" className="flex items-center font-medium">
                Anual <span className="ml-2 text-xs font-semibold text-green-600 bg-green-100 rounded-full px-2 py-0.5">Economize ~17%</span>
            </Label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
                <GlassCard key={plan.id} className={cn("flex flex-col p-6", plan.id === 'standard' && 'border-brand-accent border-2', (plan.id === 'free' && isFreePlanDisabled) && 'opacity-50')}>
                    <CardHeader className="p-0">
                        {plan.badge && <div className="text-sm font-bold text-brand-accent mb-2">{plan.badge}</div>}
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription className="h-12 text-brand-text/70">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow p-0 mt-6">
                        <div className="mb-6 h-20">
                            {plan.id === 'free' ? (<p className="text-4xl font-bold">R$ 0,00</p>) : plan.id === 'standard' ? (<> <p className="text-4xl font-bold"> {formData.billingCycle === 'annual' ? `R$ 1000,00` : `R$ 120,00`} </p> <p className="text-sm text-brand-text/70 -mt-1">{formData.billingCycle === 'annual' ? 'por ano' : 'por mês'}</p> <p className="text-xs text-brand-text/70">para até 3 usuários</p> </>) : (<div className="flex items-center pt-4"><p className="text-2xl font-bold text-brand-text/50">Em breve</p></div>)}
                        </div>
                        <ul className="space-y-2 text-sm text-brand-text">
                            {plan.features.map((feature, i) => (<li key={i} className="flex items-start gap-2"><Check className="h-4 w-4 mt-0.5 text-status-success flex-shrink-0" /><span>{feature}</span></li>))}
                        </ul>
                    </CardContent>
                    <CardFooter className="p-0 mt-6">
                        <Button 
                            className={cn("w-full", plan.id === 'standard' && "bg-brand-accent hover:bg-brand-accent-hover text-white")} 
                            disabled={plan.locked || (plan.id === 'free' && isFreePlanDisabled)} 
                            onClick={() => !plan.locked && !(plan.id === 'free' && isFreePlanDisabled) && handleSelectPlan(plan.id)} 
                            variant={plan.id === 'standard' ? 'default' : 'outline'}
                        >
                            {plan.locked ? (<><Lock className="mr-2 h-4 w-4" /> Em breve</>) 
                                : (plan.id === 'free' && isFreePlanDisabled) ? 'Teste já utilizado'
                                : plan.id === 'free' ? 'Começar agora' 
                                : 'Selecionar Plano'}
                        </Button>
                    </CardFooter>
                </GlassCard>
            ))}
        </div>
      </div>
    );
};
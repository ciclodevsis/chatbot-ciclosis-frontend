"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useSignUpContext } from "./SignUpContext";
import { createClient } from "@/utils/supabase/client";
import type { Subscription } from "@/lib/types";

// Componentes
import { StepIndicator } from "./components/StepIndicator";
import { CreateAccountStep } from "./components/1-CreateAccountStep";
import { CheckEmailStep } from "./components/2-CheckEmailStep";
import { PlanSelectionStep } from "./components/3-PlanSelectionStep";
import { PaymentStep } from "./components/4-PaymentStep";
import { Loader2 } from "lucide-react";

// O componente agora recebe a assinatura existente como uma prop.
export default function SignUpClient({ existingSubscription }: { existingSubscription: Subscription | null }) {
    const router = useRouter();
    const params = useParams<{ step?: string[] }>();
    const { formData, setFormData } = useSignUpContext();
    const supabase = createClient();
    const [isVerifying, setIsVerifying] = useState(true);

    const steps = ["Criar Conta", "Verificar E-mail", "Selecionar Plano", "Pagamento"];
    const stepSlugs = ['step-1', 'step-check-email', 'step-2', 'step-3'];
    const currentStepSlug = params.step?.[0] || 'step-1';
    const currentStepNumber = stepSlugs.indexOf(currentStepSlug) + 1;

    useEffect(() => {
        const verifyStep = async () => {
            if (!stepSlugs.includes(currentStepSlug)) {
                router.replace('/sign-up/step-1');
                return;
            }
            const requiredDataSteps = ['step-check-email', 'step-2', 'step-3'];
            if (requiredDataSteps.includes(currentStepSlug)) {
                if (formData.email) {
                    setIsVerifying(false);
                    return;
                }
                const { data: { user } } = await supabase.auth.getUser();
                if (user?.email) {
                    setFormData(prev => ({
                        ...prev,
                        email: user.email || '',
                        phone: user.user_metadata?.phone || undefined,
                    }));
                } else {
                    router.replace('/sign-up/step-1');
                }
            }
            setIsVerifying(false);
        };
        verifyStep();
    }, [currentStepSlug, formData.email, router, setFormData, supabase.auth]);

    const goToNextStep = (nextStepSlug: string) => {
        router.push(`/sign-up/${nextStepSlug}`);
    };

    const handlePlanSelection = () => {
        goToNextStep('step-3');
    };

    const finishSignUp = () => {
        window.sessionStorage.removeItem('signUpFormData');
        router.replace('/dashboard');
        router.refresh();
    };

    if (isVerifying) {
        return (
            <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Verificando sua sessão...</p>
            </div>
        );
    }

    const renderStep = () => {
        switch (currentStepSlug) {
            case 'step-1': return <CreateAccountStep onNextStep={() => goToNextStep('step-check-email')} />;
            case 'step-check-email': return <CheckEmailStep />;
            case 'step-2': return <PlanSelectionStep onPlanSelected={handlePlanSelection} existingSubscription={existingSubscription} />;
            case 'step-3': return <PaymentStep onFinish={finishSignUp} />;
            default: return null;
        }
    };

    return (
        <div className="w-full flex flex-col items-center gap-12 p-4">
            <div className="w-full max-w-4xl pt-8">
                <StepIndicator currentStep={currentStepNumber} steps={steps} />
            </div>
            <div className="w-full flex justify-center">
                {renderStep()}
            </div>
        </div>
    );
}
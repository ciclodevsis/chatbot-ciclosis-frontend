"use client";

import { useState, useEffect, useMemo } from "react";
import { useSignUpContext } from "../SignUpContext";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QrCode, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import type { Subscription } from "@/lib/types";

// Tipagens locais para esta etapa
interface AppliedCoupon {
    code: string;
    discount_type: 'percent' | 'fixed';
    discount_value: number;
}
interface PixData {
    qrCodeImage: string;
    qrCodeText: string;
    subscriptionId: string;
}

type PaymentStepProps = {
    onFinish: () => void;
};

// Hook personalizado para buscar detalhes do plano
const usePlanDetails = () => {
    const { formData } = useSignUpContext();
    // Preços em centavos para consistência com o backend
    const planDetails: { [key: string]: { name: string, price: number } } = {
        'free': { name: 'Free', price: 0 },
        'standard': { name: 'Standard', price: formData.billingCycle === 'annual' ? 180000 : 12000 },
        // Adicione outros planos aqui se necessário
    };
    return planDetails;
};

export function PaymentStep({ onFinish }: PaymentStepProps) {
    const { formData } = useSignUpContext();
    const supabase = createClient();
    const planDetails = usePlanDetails();
    const [isLoading, setIsLoading] = useState(false);
    const [couponCode, setCouponCode] = useState("");
    const [isCouponLoading, setIsCouponLoading] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [pixData, setPixData] = useState<PixData | null>(null);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'waiting' | 'confirmed'>('pending');

    // Hook para escutar a confirmação do pagamento em tempo real
    useEffect(() => {
        if (paymentStatus === 'waiting' && pixData?.subscriptionId) {
            const channel = supabase
                .channel(`subscription-status:${pixData.subscriptionId}`)
                .on<Subscription>(
                    'postgres_changes',
                    { event: 'UPDATE', schema: 'public', table: 'subscriptions', filter: `id=eq.${pixData.subscriptionId}` },
                    (payload) => {
                        // Quando o webhook atualiza o status para 'active', o frontend reage
                        if (payload.new.status === 'active') {
                            setPaymentStatus('confirmed');
                            toast.success("Pagamento confirmado!", { description: "Sua assinatura está ativa." });
                            setTimeout(() => onFinish(), 3000);
                        }
                    }
                ).subscribe();
            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [paymentStatus, pixData, onFinish, supabase]);

    // Calcula o preço final com base no plano e cupom
    const { selectedPlan, finalPrice, discountAmount } = useMemo(() => {
        const currentPlan = planDetails[formData.selectedPlan as keyof typeof planDetails] || planDetails['free'];
        let calculatedPrice = currentPlan.price;
        let discount = 0;
        if (appliedCoupon) {
            if (appliedCoupon.discount_type === 'percent') {
                discount = currentPlan.price * (appliedCoupon.discount_value / 100);
            } else if (appliedCoupon.discount_type === 'fixed') {
                // Assumindo que o valor fixo também está em centavos
                discount = appliedCoupon.discount_value;
            }
        }
        calculatedPrice -= discount;
        return {
            selectedPlan: currentPlan,
            finalPrice: Math.max(0, calculatedPrice),
            discountAmount: discount
        };
    }, [formData.selectedPlan, appliedCoupon, planDetails]);

    // Função para validar o cupom via Edge Function
    const handleApplyCoupon = async () => {
        if (!couponCode) return;
        setIsCouponLoading(true);
        setCouponError(null);
        setAppliedCoupon(null);
        try {
            // Supondo que você tenha uma Edge Function 'validate-coupon'
            const { data, error } = await supabase.functions.invoke('validate-coupon', { body: { couponCode } });
            if (error || data.error) throw new Error(data.error || "Erro ao validar o cupom.");
            
            setAppliedCoupon(data);
            toast.success("Cupom aplicado com sucesso!");
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Ocorreu um erro desconhecido.";
            setCouponError(message);
            toast.error("Erro", { description: message });
        } finally {
            setIsCouponLoading(false);
        }
    };

    // Função para finalizar o cadastro e/ou gerar o PIX
    const handleFinalSubmit = async () => {
        setIsLoading(true);
        try {
            if (finalPrice === 0) {
                // Caso para planos gratuitos ou com 100% de desconto
                const { error } = await supabase.functions.invoke('create-tenant-and-subscription', { body: { planId: formData.selectedPlan, billingCycle: formData.billingCycle, couponCode: appliedCoupon?.code } });
                if (error) throw new Error("Falha ao inicializar sua conta gratuita.");

                setPaymentStatus('confirmed');
                toast.success("Conta criada!", { description: "Bem-vindo(a) à plataforma." });
                setTimeout(() => onFinish(), 2000);
            } else {
                // Chama a Edge Function unificada 'generate-pix-payment'
                const { data, error } = await supabase.functions.invoke('generate-pix-payment', {
                    body: {
                        planId: formData.selectedPlan,
                        billingCycle: formData.billingCycle,
                        couponCode: appliedCoupon?.code
                    }
                });

                if (error) throw new Error(error.message || "Erro ao gerar PIX.");
                
                // Armazena os dados do PIX para exibição
                setPixData(data);
                setPaymentStatus('waiting');
            }
        } catch (error: unknown) {
            let message = "Ocorreu um erro desconhecido.";
            if (error instanceof Error) {
                message = error.message;
            }
            toast.error("Erro", { description: message });
        } finally {
            setIsLoading(false);
        }
    };

    // Tela de confirmação de pagamento
    if (paymentStatus === 'confirmed') {
        return (
            <Card className="w-full max-w-lg text-center p-8">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <CardTitle className="text-2xl">Cadastro Concluído!</CardTitle>
                <CardDescription>
                    Estamos preparando sua conta. Você será redirecionado em breve.
                </CardDescription>
            </Card>
        );
    }

    return (
        <Card className="w-full max-w-4xl p-6">
            <CardHeader>
                <CardTitle className="text-2xl font-bold tracking-tight">Finalize seu Cadastro</CardTitle>
                <CardDescription>Revise seu plano e finalize a inscrição.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-6">
                {/* Lado Esquerdo: Resumo do Plano e Cupom */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Resumo do seu Plano</h3>
                    <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 space-y-4 border">
                        <div className="flex justify-between font-medium">
                            <span>Plano {selectedPlan.name} ({formData.billingCycle === 'annual' ? 'Anual' : 'Mensal'})</span>
                            <span>R$ {(selectedPlan.price / 100).toFixed(2).replace('.', ',')}</span>
                        </div>
                        {appliedCoupon && (
                            <div className="flex justify-between text-sm text-green-600 border-t pt-4">
                                <span>Cupom <span className="font-semibold">{appliedCoupon.code}</span></span>
                                <span>- R$ {(discountAmount / 100).toFixed(2).replace('.', ',')}</span>
                            </div>
                        )}
                        <div className="border-t pt-4 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>R$ {(finalPrice / 100).toFixed(2).replace('.', ',')}</span>
                        </div>
                    </div>

                    {selectedPlan.price > 0 && (
                        <>
                            <h3 className="text-lg font-semibold">Cupom de Desconto</h3>
                            <div className="flex items-start gap-2">
                                <div className="grid w-full gap-1.5">
                                    <Input
                                        id="coupon"
                                        placeholder="Ex: BEMVINDO20"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                        disabled={!!appliedCoupon || isCouponLoading}
                                    />
                                    {couponError && <p className="text-xs text-red-500">{couponError}</p>}
                                </div>
                                <Button onClick={handleApplyCoupon} disabled={!!appliedCoupon || isCouponLoading} variant="outline">
                                    {isCouponLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Aplicar"}
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                {/* Lado Direito: Geração ou Exibição do PIX */}
                <div className="flex flex-col items-center justify-center p-6 md:border-l">
                    {pixData ? (
                        <div className="text-center w-full">
                            <h3 className="text-lg font-semibold">Pague com PIX para ativar</h3>
                            <p className="text-sm text-gray-500 mb-4">Escaneie o código com o app do seu banco.</p>
                            <div className="bg-white p-2 inline-block rounded-lg border">
                                {/* A imagem base64 é renderizada aqui */}
                                <img src={`data:image/jpeg;base64,${pixData.qrCodeImage}`} alt="QR Code PIX" />
                            </div>
                            <p className="text-xs text-gray-500 mt-4 mb-2">Ou use o PIX Copia e Cola:</p>
                            <Button
                                variant="secondary"
                                className="w-full h-auto py-2"
                                onClick={() => {
                                    navigator.clipboard.writeText(pixData.qrCodeText);
                                    toast.success("Código PIX copiado!");
                                }}
                            >
                                <p className="truncate text-xs whitespace-normal">{pixData.qrCodeText}</p>
                            </Button>
                            <div className="mt-6 flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span className="text-sm font-medium">Aguardando confirmação...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center">
                            {finalPrice > 0 ? (
                                <>
                                    <QrCode className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Pronto para começar?</h3>
                                    <p className="text-sm text-gray-500 mb-6">Clique para gerar seu QR Code PIX.</p>
                                    <Button size="lg" onClick={handleFinalSubmit} disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Gerar PIX de R$ {(finalPrice / 100).toFixed(2).replace('.', ',')}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold">Tudo pronto!</h3>
                                    <p className="text-sm text-gray-500 mb-6">Seu plano é gratuito. Clique para finalizar e acessar.</p>
                                    <Button size="lg" onClick={handleFinalSubmit} disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Acessar Plataforma
                                    </Button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};
"use client";

import { useState, useTransition } from "react";
import { regeneratePixAction } from "@/lib/actions/payment.actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode } from "lucide-react";

interface PixData {
  qrCodeImage: string;
  qrCodeText: string;
}

type FinishPaymentClientProps = {
  subscriptionId: string;
  planName: string;
};

export function FinishPaymentClient({ subscriptionId, planName }: FinishPaymentClientProps) {
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleRegeneratePix = () => {
    startTransition(async () => {
      const result = await regeneratePixAction(subscriptionId);
      if ('error' in result) {
        toast.error("Erro", { description: result.error });
      } else {
        setPixData(result);
      }
    });
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Finalize seu Pagamento</CardTitle>
          <CardDescription>
            Sua assinatura para o plano {planName} está pendente. Use o QR Code abaixo para completar o pagamento.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
          {isPending ? (
            <div className="flex flex-col items-center gap-4 text-brand-text-secondary">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p>Gerando novo PIX...</p>
            </div>
          ) : pixData ? (
            <div className="text-center w-full space-y-4">
              <h3 className="text-lg font-semibold text-brand-text">Pague com PIX para ativar</h3>
              <p className="text-sm text-brand-text-secondary">Escaneie o código com o app do seu banco.</p>
              <div className="bg-white p-2 inline-block rounded-lg border">
                <img src={`data:image/jpeg;base64,${pixData.qrCodeImage}`} alt="QR Code PIX" />
              </div>
              <p className="text-xs text-brand-text-secondary pt-2">Ou use o PIX Copia e Cola:</p>
              <Button variant="secondary" className="w-full h-auto py-2" onClick={() => navigator.clipboard.writeText(pixData.qrCodeText)}>
                <p className="truncate text-xs whitespace-normal">{pixData.qrCodeText}</p>
              </Button>
            </div>
          ) : (
            <div className="text-center w-full space-y-4">
              <QrCode className="h-16 w-16 text-brand-text-secondary mx-auto" />
              <p className="text-brand-text-secondary">Clique no botão abaixo para gerar um novo QR Code para pagamento.</p>
              <Button onClick={handleRegeneratePix} className="bg-brand-accent hover:bg-brand-accent-hover text-white">
                Gerar PIX
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
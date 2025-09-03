// CAMINHO: app/(main)/settings/components/CompanySettingsForm.tsx

"use client";

import React, { useState, useEffect } from 'react';
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { FaWhatsapp } from 'react-icons/fa';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { saveCompanySettings } from "@/lib/actions/company.actions";
import type { CompanySettings } from "@/lib/types";
import type { FormState } from "@/lib/actions/types";

interface CompanySettingsFormProps {
  settings: CompanySettings | null;
}

export function CompanySettingsForm({ settings }: CompanySettingsFormProps) {
  const initialState: FormState = null;
  const [state, formAction] = useFormState(saveCompanySettings, initialState);
  
  // --- LÓGICA DE CONEXÃO DO WHATSAPP ---
  const [isWhatsAppConnected, setIsWhatsAppConnected] = useState(!!settings?.whatsapp_phone_id);
  const [popup, setPopup] = useState<Window | null>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success("Sucesso!", { description: state.message });
    } else if (state?.error) {
      toast.error("Erro!", { description: state.error });
    }
  }, [state]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Adicionar verificação de origem por segurança em produção
      // if (event.origin !== window.location.origin) return;
      
      const { type, message } = event.data;

      if (type === 'WHATSAPP_ONBOARDING_SUCCESS') {
        toast.success('WhatsApp conectado com sucesso!');
        setIsWhatsAppConnected(true);
        if (popup) popup.close();
      } else if (type === 'WHATSAPP_ONBOARDING_ERROR') {
        toast.error(`Falha na conexão: ${message || 'Tente novamente.'}`);
        if (popup) popup.close();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [popup]);

  const openOnboardingPopup = () => {
    const width = 800, height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    // TODO: A URL do seu backend de onboarding precisa estar em uma variável de ambiente
    const url = '/whatsapp-onboarding'; // Ou a URL completa
    const newPopup = window.open(url, 'whatsappOnboarding', `width=${width},height=${height},left=${left},top=${top}`);
    setPopup(newPopup);
  };

  const handleDisconnect = () => {
    // TODO: Implementar a chamada à Server Action para desconectar no backend.
    console.log("Implementar lógica de desconexão.");
    toast.success('WhatsApp desconectado.');
    setIsWhatsAppConnected(false);
  };
  // --- FIM DA LÓGICA DO WHATSAPP ---

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Empresa</CardTitle>
        <CardDescription>Gerencie as informações gerais do seu negócio e integrações.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-8">
            {/* Campos de Informações da Empresa */}
            <div className="space-y-2">
              <Label htmlFor="companyName">Nome da Empresa</Label>
              <Input id="companyName" name="companyName" placeholder="Sua Empresa" defaultValue={settings?.company_name || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone de Contato</Label>
              <Input id="phone" name="phone" placeholder="(XX) XXXXX-XXXX" defaultValue={settings?.phone || ""} />
            </div>
            
            {/* Campos de Endereço */}
            <div className="space-y-2">
              <Label htmlFor="addressStreet">Rua e Número</Label>
              <Input id="addressStreet" name="addressStreet" placeholder="Av. Principal, 123" defaultValue={settings?.address_street || ""} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="addressCity">Cidade</Label>
                <Input id="addressCity" name="addressCity" defaultValue={settings?.address_city || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressState">Estado</Label>
                <Input id="addressState" name="addressState" defaultValue={settings?.address_state || ""} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="addressZipCode">CEP</Label>
                <Input id="addressZipCode" name="addressZipCode" defaultValue={settings?.address_zip_code || ""} />
              </div>
            </div>

            {/* Seção de Integração com WhatsApp */}
            <div className="space-y-4 pt-6 border-t">
              <div>
                <h3 className="text-lg font-medium">Integração com WhatsApp</h3>
                <p className="text-sm text-muted-foreground">
                  Conecte sua conta do WhatsApp Business para automatizar mensagens.
                </p>
              </div>
              
              {isWhatsAppConnected ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FaWhatsapp className="text-green-600 h-8 w-8" />
                    <div>
                      <p className="font-semibold text-green-800">WhatsApp Conectado</p>
                      <p className="text-sm text-green-700">Sua conta está ativa e pronta para uso.</p>
                    </div>
                  </div>
                  <Button type="button" variant="destructive" onClick={handleDisconnect}>
                    Desconectar
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-semibold text-gray-800">Nenhuma conta conectada</p>
                    <p className="text-sm text-gray-600">Clique no botão para iniciar a configuração.</p>
                  </div>
                  <Button type="button" onClick={openOnboardingPopup}>
                    <FaWhatsapp className="mr-2 h-4 w-4" /> Conectar WhatsApp
                  </Button>
                </div>
              )}
            </div>
            
            <Button type="submit">Salvar Alterações</Button>
        </form>
      </CardContent>
    </Card>
  );
}
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import axios, { type AxiosError } from 'axios';
import { useSearchParams } from 'next/navigation';
import { createClient } from "@/utils/supabase/client";

// --- UI Components ---
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, AlertTriangle } from 'lucide-react';

// --- INTERFACES E API ---
interface Business { id: string; name: string; }
interface Waba { id: string; name: string; }
interface PhoneNumber { id: string; display_phone_number: string; }

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("Tentando acessar a API em:", API_URL);

const apiClient = axios.create({ baseURL: API_URL });

apiClient.interceptors.request.use(async (config) => {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
});

// --- Componente principal ---
const OnboardingComponent: React.FC = () => {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<number>(1);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [wabas, setWabas] = useState<Waba[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('');
  const [selectedWabaId, setSelectedWabaId] = useState<string>('');
  const [selectedPhoneNumberId, setSelectedPhoneNumberId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const status = searchParams.get('status');
    const message = searchParams.get('message');

    if (status === 'error') {
      const decodedMessage = message ? decodeURIComponent(message) : 'Ocorreu um erro no servidor.';
      window.opener?.postMessage({ type: 'WHATSAPP_ONBOARDING_ERROR', message: decodedMessage }, '*');
      window.close();
      return;
    }
    
    if (status === 'success') {
      setStep(2);
    }
  }, [searchParams]);

  useEffect(() => {
    if (step === 2) {
      const fetchBusinesses = async () => {
        setIsLoading(true); setError(null);
        try {
          const response = await apiClient.get<{ data: Business[] }>('/onboarding/businesses');
          setBusinesses(response.data.data || []);
        } catch (err) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'Falha ao carregar as contas empresariais.');
        } finally { setIsLoading(false); }
      };
      fetchBusinesses();
    }
  }, [step]);

  useEffect(() => {
    if (selectedBusinessId) {
      const fetchWabas = async () => {
        setIsLoading(true); setError(null); setWabas([]); setSelectedWabaId('');
        try {
          const response = await apiClient.get<{ data: Waba[] }>(`/onboarding/wabas/${selectedBusinessId}`);
          setWabas(response.data.data || []);
        } catch (err) {
          const axiosError = err as AxiosError<{ message: string }>;
          setError(axiosError.response?.data?.message || 'Falha ao carregar as contas do WhatsApp.');
        } finally { setIsLoading(false); }
      };
      fetchWabas();
    }
  }, [selectedBusinessId]);

  useEffect(() => {
    if (selectedWabaId) {
        const fetchPhoneNumbers = async () => {
            setIsLoading(true); setError(null); setPhoneNumbers([]); setSelectedPhoneNumberId('');
            try {
                const response = await apiClient.get<{ data: PhoneNumber[] }>(`/onboarding/phone-numbers/${selectedWabaId}`);
                setPhoneNumbers(response.data.data || []);
            } catch (err) {
                const axiosError = err as AxiosError<{ message: string }>;
                setError(axiosError.response?.data?.message || 'Falha ao carregar os números de telefone.');
            } finally { setIsLoading(false); }
        };
        fetchPhoneNumbers();
    }
  }, [selectedWabaId]);

  const handleConnect = async () => {
    try {
      const response = await apiClient.get<{ url: string }>('/onboarding/auth/meta');
      window.location.href = response.data.url;
    } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Não foi possível iniciar a conexão com a Meta.');
    }
  };
    
  const handleFinish = async () => {
    setIsLoading(true); setError(null);
    try {
        // ✅ CORREÇÃO: Envia tanto o wabaId quanto o phoneNumberId
        await apiClient.post('/onboarding/complete', { 
            wabaId: selectedWabaId,
            phoneNumberId: selectedPhoneNumberId 
        });
        window.opener?.postMessage({ type: 'WHATSAPP_ONBOARDING_SUCCESS' }, '*');
        window.close();
    } catch (err) {
        const axiosError = err as AxiosError<{ message: string }>;
        setError(axiosError.response?.data?.message || 'Falha ao finalizar a configuração.');
    } finally {
        setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Card className="w-full max-w-md">
      <CardHeader><CardTitle>Passo 1: Conecte sua Conta Meta</CardTitle><CardDescription>Autorize nosso app a acessar suas informações do WhatsApp Business.</CardDescription></CardHeader>
      <CardContent><p className="text-sm text-muted-foreground mb-4">Você será redirecionado para uma página segura da Meta para concluir a autorização.</p></CardContent>
      <CardFooter><Button className="w-full" onClick={handleConnect}>Conectar com Facebook</Button></CardFooter>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="w-full max-w-md">
      <CardHeader><CardTitle>Passo 2: Selecione suas Contas</CardTitle><CardDescription>Escolha a conta empresarial, a conta do WhatsApp e o número que deseja conectar.</CardDescription></CardHeader>
      <CardContent className="space-y-4">
        <Select onValueChange={setSelectedBusinessId} value={selectedBusinessId} disabled={isLoading}><SelectTrigger><SelectValue placeholder="Selecione sua empresa" /></SelectTrigger><SelectContent>{businesses.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent></Select>
        {selectedBusinessId && <Select onValueChange={setSelectedWabaId} value={selectedWabaId} disabled={isLoading || wabas.length === 0}><SelectTrigger><SelectValue placeholder="Selecione a conta do WhatsApp" /></SelectTrigger><SelectContent>{wabas.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent></Select>}
        {selectedWabaId && <Select onValueChange={setSelectedPhoneNumberId} value={selectedPhoneNumberId} disabled={isLoading || phoneNumbers.length === 0}><SelectTrigger><SelectValue placeholder="Selecione o número de telefone" /></SelectTrigger><SelectContent>{phoneNumbers.map((p) => <SelectItem key={p.id} value={p.id}>{p.display_phone_number}</SelectItem>)}</SelectContent></Select>}
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleFinish} disabled={!selectedPhoneNumberId || isLoading}>
          {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finalizando...</> : "Concluir e Conectar"}
        </Button>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="mb-8 flex items-center gap-4 text-sm font-medium text-gray-500">
        <span className={step >= 1 ? 'text-blue-600' : ''}>Conexão</span> &gt;
        <span className={step >= 2 ? 'text-blue-600' : ''}>Seleção</span>
      </div>
      {isLoading && <p className="mb-4 flex items-center gap-2 text-gray-600"><Loader2 className="animate-spin h-4 w-4"/> Carregando...</p>}
      {error && <p className="mb-4 text-red-600 bg-red-100 p-3 rounded-md flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> {error}</p>}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </div>
  );
};

const WhatsAppOnboarding: React.FC = () => (
  <Suspense fallback={<div className="flex items-center justify-center h-screen">Carregando...</div>}>
    <OnboardingComponent />
  </Suspense>
);

export default WhatsAppOnboarding;
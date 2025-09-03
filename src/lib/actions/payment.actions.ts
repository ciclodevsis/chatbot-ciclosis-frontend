"use server";

import { createClient } from "@/utils/supabase/server";
import { getUserSession } from "../session";
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function getPendingSubscription(): Promise<{ subscriptionId: string; planName: string } | null> {
  // ✅ CORREÇÃO: Usa a nova estrutura de sessão e acessa os detalhes do perfil.
  const { details } = await getUserSession();
  if (!details?.profile?.tenant_id) {
    console.error("getPendingSubscription: Tenant ID não encontrado na sessão.");
    return null;
  }

  const supabase = createClient();
  const { data } = await supabase
    .from('subscriptions')
    .select('id, plan:plans(name)')
    .eq('tenant_id', details.profile.tenant_id)
    .eq('status', 'pending_payment')
    .maybeSingle();

  if (!data) return null;
  
  // A API pode retornar um array ou um objeto, esta linha trata ambos os casos.
  const plan = Array.isArray(data.plan) ? data.plan[0] : data.plan;

  return {
    subscriptionId: data.id,
    planName: plan?.name || 'Plano'
  };
}

export async function regeneratePixAction(subscriptionId: string): Promise<{ qrCodeImage: string; qrCodeText: string; } | { error: string }> {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    return { error: 'Usuário não autenticado.' };
  }

  try {
    const response = await axios.post(`${API_URL}/payments/regenerate-pix/${subscriptionId}`, {}, {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return { error: error.response?.data?.message || 'Não foi possível gerar um novo PIX.' };
    }
    return { error: 'Ocorreu um erro inesperado.' };
  }
}
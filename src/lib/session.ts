"use server";

import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";

// Interface para definir a estrutura dos dados da sessão
export interface UserSessionDetails {
  user: User;
  profile: {
    tenant_id: string;
    role: string;
  } | null;
  subscription: {
    status: string;
    trial_end: string | null;
  } | null;
  isSubscriptionActive: boolean;
}

/**
 * Busca os dados completos da sessão do usuário atual.
 * Agora faz as buscas de forma sequencial para evitar deadlocks de RLS.
 */
export async function getUserSession(): Promise<{ user: User | null; details: UserSessionDetails | null }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log("[session.ts] Nenhum usuário encontrado na sessão.");
    return { user: null, details: null };
  }

  console.log(`[session.ts] Verificando perfil para o usuário ID: ${user.id}`);

  // ✅ CORREÇÃO: PASSO 1 - Busca apenas o perfil primeiro.
  // Esta consulta é simples e não será bloqueada pela RLS.
  const { data: profile } = await supabase
    .from("profiles")
    .select("tenant_id, role")
    .eq("id", user.id)
    .single();

  console.log('[session.ts] Resultado da busca pelo perfil:', JSON.stringify(profile, null, 2));

  if (!profile) {
    console.error(`[session.ts] ERRO CRÍTICO: Perfil não encontrado para o usuário ${user.id}.`);
    return { user, details: null };
  }
  
  if (!profile.tenant_id) {
    // Se o usuário tem perfil mas não tem tenant, os detalhes são "incompletos"
    const incompleteDetails: UserSessionDetails = {
        user,
        profile: { tenant_id: profile.tenant_id, role: profile.role },
        subscription: null,
        isSubscriptionActive: false,
    };
    return { user, details: incompleteDetails };
  }

  // ✅ CORREÇÃO: PASSO 2 - Com o tenant_id em mãos, busca a assinatura.
  // Esta consulta também é simples e não causará deadlock.
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status, trial_end")
    .eq("tenant_id", profile.tenant_id)
    .maybeSingle(); // Usamos maybeSingle para não dar erro se não houver assinatura

  console.log('[session.ts] Resultado da busca pela assinatura:', JSON.stringify(subscription, null, 2));
  
  const isSubscriptionActive = !!(subscription && 
    (subscription.status === 'active' || (subscription.status === 'trialing' && subscription.trial_end && new Date(subscription.trial_end) > new Date()))
  );

  const details: UserSessionDetails = {
    user,
    profile: { tenant_id: profile.tenant_id, role: profile.role },
    subscription: subscription ? { status: subscription.status, trial_end: subscription.trial_end } : null,
    isSubscriptionActive,
  };
  
  console.log(`[session.ts] Status final calculado: isSubscriptionActive = ${isSubscriptionActive}`);
  return { user, details };
}
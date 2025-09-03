"use server";

import { createClient } from "@/utils/supabase/server";

export async function createCustomerPortalAction(): Promise<{ url?: string; error?: string }> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      throw new Error("Usuário não autenticado.");
    }
    
    // ✅ SEGURANÇA: A action do frontend chama a API do backend, enviando o token JWT do usuário.
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billing/customer-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Falha ao criar sessão do portal.");
    }

    const { portalUrl } = await response.json();
    return { url: portalUrl };

  } catch (error) {
    console.error("Erro na action createCustomerPortalAction:", error);
    return { error: error instanceof Error ? error.message : "Ocorreu um erro desconhecido." };
  }
}
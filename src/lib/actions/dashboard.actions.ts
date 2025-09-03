// Caminho: lib/actions/dashboard.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUserSession } from "../session";
import { getDashboardChartData } from "../data";
import type { FormState } from "./types";
import { GoalSchema } from "../validators";

export async function getChartDataAction(period: 'week' | 'month' | 'year', staffId?: string | null) {
  return await getDashboardChartData(period, staffId);
}

/**
 * Server Action para criar ou atualizar a meta de um usuário no dashboard.
 */
export async function updateGoalAction(prevState: FormState, formData: FormData): Promise<FormState> {
  // 1. Obtém a sessão e verifica se o usuário e o perfil existem.
  const { user, details } = await getUserSession();
  if (!user || !details?.profile) {
    return { error: "Usuário não autenticado ou perfil não encontrado." };
  }
  const { tenant_id: tenantId } = details.profile;

  // 2. Valida os dados do formulário com Zod.
  const validatedFields = GoalSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return { error: firstError || "Valor da meta inválido." };
  }
  const { goalType, goalValue } = validatedFields.data;
  
  // 3. Executa a operação no banco de dados.
  const supabase = createClient();
  const { error } = await supabase.from('dashboard_goals').upsert({
    tenant_id: tenantId,
    user_id: user.id,
    goal_type: goalType,
    value: goalValue,
  }, { onConflict: 'tenant_id, user_id, goal_type' });
  
  if (error) { 
    console.error("Erro ao salvar meta:", error);
    return { error: "Não foi possível salvar a meta." }; 
  }
  
  // 4. Revalida o cache e retorna sucesso.
  revalidatePath('/dashboard');
  return { success: true, message: "Meta atualizada com sucesso!" };
}
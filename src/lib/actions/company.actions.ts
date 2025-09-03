"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUserSession } from "../session";
import { CompanySettingsSchema } from "../validators";
import type { FormState } from "./types";

export async function saveCompanySettings(prevState: FormState, formData: FormData): Promise<FormState> {
  // ✅ CORREÇÃO: Usa a nova estrutura de sessão e verifica os detalhes do perfil.
  const { details } = await getUserSession();

  if (!details?.profile || details.profile.role !== 'admin') {
    return { error: "Acesso negado. Permissão insuficiente." };
  }
  const { tenant_id: tenantId } = details.profile;

  const validatedFields = CompanySettingsSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    const firstError = Object.values(validatedFields.error.flatten().fieldErrors)[0]?.[0];
    return { error: firstError || "Erro de validação." };
  }

  const { companyName, ...settingsData } = validatedFields.data;
  const supabase = createClient();

  // Operação 1: Atualiza o nome na tabela 'tenants'
  const { error: tenantError } = await supabase
    .from("tenants")
    .update({ name: companyName })
    .eq("id", tenantId);

  if (tenantError) {
    console.error("Erro ao atualizar tenants:", tenantError);
    return { error: "Não foi possível atualizar o nome da empresa." };
  }

  // Operação 2: Faz o "upsert" dos detalhes na tabela 'tenants_settings'
  const { error: settingsError } = await supabase
    .from("tenants_settings")
    .upsert({
      tenant_id: tenantId,
      company_name: companyName,
      phone: settingsData.phone,
      address_street: settingsData.addressStreet,
      address_city: settingsData.addressCity,
      address_state: settingsData.addressState,
      address_zip_code: settingsData.addressZipCode,
      welcome_message: settingsData.welcomeMessage,
    });

  if (settingsError) {
    console.error("Erro ao salvar tenants_settings:", settingsError);
    return { error: "Não foi possível salvar os detalhes da empresa." };
  }

  revalidatePath("/settings");
  return { success: true, message: "Configurações salvas com sucesso." };
}
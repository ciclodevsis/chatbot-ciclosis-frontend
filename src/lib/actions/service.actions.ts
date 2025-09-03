"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { getUserSession } from "../session";
import { ServiceSchema } from "../validators";
import type { FormState } from "./types";

export async function saveService(prevState: FormState, formData: FormData): Promise<FormState> {
  // ✅ CORREÇÃO: Usa a nova estrutura de sessão e verifica os detalhes do perfil.
  const { details } = await getUserSession();
  if (!details?.profile || details.profile.role !== 'admin') {
    return { error: "Acesso negado. Apenas administradores podem gerenciar serviços." };
  }
  const { tenant_id: tenantId } = details.profile;

  const validatedFields = ServiceSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    // Retorna o erro de validação do Zod
    return { errors: validatedFields.error.flatten().fieldErrors };
  }

  const supabase = createClient();
  const serviceData = { ...validatedFields.data, tenant_id: tenantId };
  const { error } = await supabase.from("services").upsert(serviceData);

  if (error) {
    console.error("Erro ao salvar serviço:", error);
    return { error: "Não foi possível salvar o serviço." };
  }

  revalidatePath("/settings");
  return { success: true, message: "Serviço salvo com sucesso." };
}

export async function deleteService(serviceId: string): Promise<FormState> {
  // ✅ CORREÇÃO: Usa a nova estrutura de sessão e verifica a role.
  const { details } = await getUserSession();
  if (!details?.profile || details.profile.role !== 'admin') {
    return { error: "Acesso negado." };
  }
  
  const supabase = createClient();
  // A segurança é garantida pela RLS, mas a checagem de role aqui é uma boa prática.
  const { error } = await supabase.from("services").delete().eq("id", serviceId);

  if (error) {
    console.error("Erro ao excluir serviço:", error);
    return { error: "Não foi possível excluir o serviço." };
  }

  revalidatePath("/settings");
  return { success: true, message: "Serviço excluído com sucesso." };
}
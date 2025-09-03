"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { getUserSession } from "../session";
import { InviteStaffSchema, UpdateStaffRoleSchema } from "../validators";
import type { FormState } from "./types";

export async function inviteStaffMember(prevState: FormState, formData: FormData): Promise<FormState> {
  try {
    const { details } = await getUserSession();
    if (!details?.profile || details.profile.role !== 'admin') {
      return { error: "Acesso negado. Apenas administradores podem convidar funcionários." };
    }
    const { tenant_id: tenantId } = details.profile;

    const supabase = createClient();
    const { data: canAdd, error: checkError } = await supabase.rpc('can_add_user_to_tenant', { p_tenant_id: tenantId });
    if (checkError) throw checkError;

    if (canAdd === false) {
      return { error: "Você atingiu o limite de usuários para o seu plano atual." };
    }

    const validatedFields = InviteStaffSchema.safeParse(Object.fromEntries(formData.entries()));
    if (!validatedFields.success) {
      return { error: validatedFields.error.flatten().fieldErrors.email?.[0] };
    }
    const { email } = validatedFields.data;

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { tenant_id: tenantId, role: 'staff' },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
    });
    if (error) throw error;

    revalidatePath("/staff");
    return { success: true, message: `Convite enviado com sucesso para ${email}.` };
  } catch (error) {
    console.error("ERRO INESPERADO em 'inviteStaffMember':", error);
    const message = error instanceof Error && error.message.includes("User already registered")
      ? "Este e-mail já está cadastrado no sistema."
      : "Ocorreu uma falha inesperada ao enviar o convite.";
    return { error: message };
  }
}

export async function removeStaffMember(userId: string): Promise<FormState> {
  const { details } = await getUserSession();
  if (!details?.profile || details.profile.role !== 'admin') {
    return { error: "Acesso negado." };
  }
  if (!userId) return { error: "ID do usuário não fornecido." };

  const supabaseAdmin = createAdminClient();
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) {
    return { error: "Não foi possível remover o funcionário." };
  }

  revalidatePath("/staff");
  return { success: true, message: "Funcionário removido com sucesso." };
}

export async function updateStaffRole(prevState: FormState, formData: FormData): Promise<FormState> {
  const { details } = await getUserSession();
  if (!details?.profile || details.profile.role !== 'admin') {
      return { error: "Acesso negado." };
  }
  const validatedFields = UpdateStaffRoleSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
      return { error: "Dados inválidos." };
  }
  const { userId, newRole } = validatedFields.data;

  const supabase = createClient();
  const { error } = await supabase.from("profiles").update({ role: newRole }).eq("id", userId);
  if (error) {
      return { error: "Não foi possível atualizar a função." };
  }

  revalidatePath("/staff");
  return { success: true, message: "Função do usuário atualizada com sucesso." };
}

export async function updateStaffServices(prevState: FormState, formData: FormData): Promise<FormState> {
  const { user, details } = await getUserSession();
  if (!user || !details?.profile) {
    return { error: "Usuário ou perfil não encontrado." };
  }

  const supabase = createClient();
  const enabledServiceIds = Array.from(formData.keys());

  const { error: deleteError } = await supabase.from('staff_services').delete().eq('staff_id', user.id);
  if (deleteError) {
    return { error: "Erro ao limpar serviços antigos." };
  }

  if (enabledServiceIds.length > 0) {
    const newStaffServices = enabledServiceIds.map(serviceId => ({
      staff_id: user.id,
      service_id: serviceId,
      tenant_id: details.profile!.tenant_id // Usamos '!' pois já verificamos 'profile'
    }));
    const { error: insertError } = await supabase.from('staff_services').insert(newStaffServices);
    if (insertError) {
      return { error: "Erro ao salvar novos serviços." };
    }
  }

  revalidatePath('/settings');
  return { success: true, message: "Seus serviços foram atualizados com sucesso." };
}

export async function saveWorkSchedule(prevState: FormState, formData: FormData): Promise<FormState> {
    const { user, details } = await getUserSession();
    if (!user || !details?.profile) {
      return { error: "Usuário ou perfil não encontrado." };
    }

    const supabase = createClient();
    const daysOfWeek = [1, 2, 3, 4, 5, 6, 0];
    const scheduleData = daysOfWeek.map(day => ({
        staff_id: user.id,
        tenant_id: details.profile!.tenant_id, // Usamos '!' pois já verificamos 'profile'
        day_of_week: day,
        is_active: formData.get(`day_${day}_active`) === 'on',
        start_time: formData.get(`day_${day}_start`) as string || '09:00',
        end_time: formData.get(`day_${day}_end`) as string || '18:00',
    }));

    const { error } = await supabase.from('work_schedules').upsert(scheduleData, { onConflict: 'staff_id, day_of_week' });
    if (error) {
        return { error: "Não foi possível salvar o horário." };
    }

    revalidatePath('/settings');
    return { success: true, message: "Horário de trabalho atualizado com sucesso." };
}
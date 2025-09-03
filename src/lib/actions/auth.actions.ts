"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { AuthSchema, UserProfileSchema, ForgotPasswordSchema } from "../validators";
import type { FormState } from "./types";
import { getUserSession } from "../session";

export async function signIn(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  const validatedFields = AuthSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: "E-mail ou senha em formato inválido." };
  }
  
  const { email, password } = validatedFields.data;
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Credenciais inválidas. Por favor, verifique seu e-mail e senha." };
  }
  
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateUserProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  // ✅ CORREÇÃO: Usa a nova função de sessão e verifica se o usuário existe.
  const { user } = await getUserSession();
  if (!user) {
    return { error: "Usuário não autenticado." };
  }

  const supabase = createClient();
  const validatedFields = UserProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.flatten().fieldErrors.fullName?.[0];
    return { error: errorMessage || "Dados inválidos." };
  }
  const { fullName } = validatedFields.data;

  const { error } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    return { error: "Não foi possível atualizar o perfil." };
  }

  revalidatePath("/settings");
  return { success: true, message: "Perfil atualizado com sucesso!" };
}

export async function forgotPassword(prevState: FormState, formData: FormData): Promise<FormState> {
  const supabase = createClient();
  const validatedFields = ForgotPasswordSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors.email?.[0] };
  }
  const { email } = validatedFields.data;
  const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`;

  await supabase.auth.resetPasswordForEmail(email, { redirectTo });
  
  return { success: true, message: "Se uma conta com este e-mail existir, um link de recuperação foi enviado." };
}
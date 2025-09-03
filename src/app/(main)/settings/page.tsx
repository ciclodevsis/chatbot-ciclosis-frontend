import { redirect } from "next/navigation";
import { SettingsTabs } from "./components/SettingsTabs";
import { getServices, getServicesForStaff, getStaffWorkSchedule, getCompanySettings } from "@/lib/data";
import { createClient } from "@/utils/supabase/server";
import type { Service, ServiceWithEnabledStatus, WorkSchedule, CompanySettings } from "@/lib/types";

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name, tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.tenant_id) {
    // Se o usuário não tem perfil ou tenant, o cadastro não foi concluído.
    redirect('/sign-up/step-2');
  }
  
  const { role, full_name } = profile;

  // Busca os dados de forma condicional com base na função do usuário
  let adminServices: Service[] = [];
  let staffServices: ServiceWithEnabledStatus[] = [];
  let staffSchedule: WorkSchedule[] = [];
  let companySettings: CompanySettings | null = null;

  // Apenas admins precisam desses dados
  if (role === 'admin') {
    [adminServices, companySettings] = await Promise.all([
      getServices(),
      getCompanySettings()
    ]);
  }
  
  // Apenas staff precisa desses dados
  if (role === 'staff') {
    [staffServices, staffSchedule] = await Promise.all([
      getServicesForStaff(user.id),
      getStaffWorkSchedule(user.id)
    ]);
  }
  
  const userName = full_name || user.email || '';
  const userEmail = user.email || '';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Configurações
        </h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e do seu negócio.
        </p>
      </div>

      <SettingsTabs 
        userRole={role as 'admin' | 'staff'} 
        user={{ email: userEmail, fullName: userName }}
        companySettings={companySettings}
        services={adminServices} 
        staffServices={staffServices}
        staffSchedule={staffSchedule}
      />
    </div>
  );
}
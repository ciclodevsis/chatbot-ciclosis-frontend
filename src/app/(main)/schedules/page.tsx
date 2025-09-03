// CAMINHO: app/(main)/schedules/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getAppointments, getStaffMembers, getServices } from "@/lib/data";
import { SchedulesClient } from "./components/SchedulesClient";

export default async function SchedulesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  const { data: profile } = await supabase.from('profiles').select('tenant_id, role').eq('id', user.id).single();
  if (!profile?.tenant_id) { redirect('/sign-up/step-2'); }

  // ✅ MELHORIA: Busca de dados simplificada e segura, usando as funções refatoradas
  const [appointments, staffList, services] = await Promise.all([
    getAppointments(),
    getStaffMembers(),
    getServices()
  ]);

  return (
    <SchedulesClient
      appointments={appointments}
      staffList={staffList}
      services={services}
      userRole={profile.role as 'admin' | 'staff'}
      currentUserId={user.id}
      tenantId={profile.tenant_id}
    />
  );
}
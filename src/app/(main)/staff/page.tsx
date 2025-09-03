// CAMINHO: app/(main)/staff/page.tsx

import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getStaffMembers } from "@/lib/data"; // ✅ A função de dados agora é autossuficiente
import { columns } from "./components/columns";
import { StaffTable } from "./components/StaffTable";
import { InviteStaffDialog } from "./components/InviteStaffDialog";

export default async function StaffPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  const { data: profile } = await supabase.from('profiles').select('role, tenant_id').eq('id', user.id).single();
  // A verificação de segurança aqui é excelente e foi mantida.
  if (profile?.role !== 'admin' || !profile?.tenant_id) { 
    redirect('/dashboard'); 
  }

  // ✅ CORREÇÃO: A chamada para getStaffMembers() agora é mais simples e segura.
  const staff = await getStaffMembers();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">Gerencie e convide os membros da sua equipe.</p>
        </div>
        <InviteStaffDialog tenantId={profile.tenant_id} />
      </div>
      <StaffTable columns={columns} data={staff} />
    </div>
  );
}
import { redirect } from "next/navigation";
import { getDashboardStats, getStaffMembers } from '@/lib/data';
import { DashboardClient } from './components/DashboardClient';
import { createClient } from "@/utils/supabase/server";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  const userRole = profile?.role as 'admin' | 'staff' || 'staff';

  // ✅ CORREÇÃO: Removemos a busca de 'getDashboardChartData' do servidor.
  // A página agora busca apenas os dados estáticos necessários.
  const [statsData, staffMembers] = await Promise.all([
    getDashboardStats(),
    getStaffMembers()
  ]);

  return (
    <DashboardClient
      initialStats={statsData}
      // ✅ CORREÇÃO: A prop 'initialCharts' foi removida.
      staffMembers={staffMembers}
      userRole={userRole}
    />
  );
}
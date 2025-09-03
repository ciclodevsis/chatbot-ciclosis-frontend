import { createClient } from "@/utils/supabase/server";
import { getStaffMembers } from "@/lib/data";
import { redirect } from "next/navigation";
import { CalendarView } from "./components/CalendarView";

export default async function AgendaPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/login'); }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, tenant_id')
    .eq('id', user.id)
    .single();

  if (!profile?.tenant_id) {
    redirect('/sign-up/step-2');
  }
  
  const staffList = await getStaffMembers();

  const { data: staffProfile } = await supabase
    .from('staff')
    .select('google_refresh_token')
    .eq('id', user.id)
    .single();

  const isConnected = !!staffProfile?.google_refresh_token;

  return (
    <CalendarView
      isConnected={isConnected}
      staffList={staffList}
      userRole={profile.role as 'admin' | 'staff'}
      currentUserId={user.id}
      tenantId={profile.tenant_id}
    />
  );
}
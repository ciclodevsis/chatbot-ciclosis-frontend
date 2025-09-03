import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getSubscription } from "@/lib/data";
import { BillingClient } from "./components/BillingClient";

export default async function BillingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }

  // A chamada para getSubscription agora funciona corretamente.
  const subscription = await getSubscription();

  return (
    <BillingClient subscription={subscription} />
  );
}
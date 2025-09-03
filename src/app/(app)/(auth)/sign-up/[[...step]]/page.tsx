import SignUpClient from './SignUpClient';
import { createClient } from '@/utils/supabase/server';
import type { Subscription } from '@/lib/types';

export default async function SignUpPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let subscription: Subscription | null = null;
  
  // Se o usuário estiver logado, tentamos buscar uma assinatura existente.
  if (user) {
    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();
    subscription = data;
  }

  // Passa a assinatura (ou null) para o componente cliente.
  return <SignUpClient existingSubscription={subscription} />;
}
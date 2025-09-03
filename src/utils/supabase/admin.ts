// Caminho: utils/supabase/admin.ts

import { createClient } from '@supabase/supabase-js';

// NOTA: Este cliente USA a chave de serviço (service_role), que tem privilégios totais.
// Ele IGNORA as políticas de RLS.
// Use-o SOMENTE no servidor (em Server Actions ou Route Handlers) para operações administrativas.
// NUNCA exponha esta lógica ou a chave de serviço ao lado do cliente.

export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
};
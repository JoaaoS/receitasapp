import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com privilégios de service_role.
 *
 * NUNCA importe este arquivo em código client-side ou em middleware.ts.
 * Use apenas em route handlers (app/api) ou em server actions.
 *
 * Esta chave ignora RLS — qualquer query feita com ela tem acesso total.
 */
export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Variáveis NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias.'
    );
  }

  return createSupabaseClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

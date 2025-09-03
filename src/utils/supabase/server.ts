// utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient() {
  // 1. A função `cookies()` de `next/headers` é síncrona, 
  //    portanto, 'async' e 'await' não são necessários.
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // O `try...catch` é a forma robusta de lidar com a tentativa
            // de definir um cookie em um Server Component, que é um
            // contexto somente leitura.
            cookieStore.set({ name, value, ...options })
          } catch {
            // No lado do servidor, em cenários como Server Actions ou Route Handlers,
            // isso funcionará. Em Server Components, o erro será ignorado.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // A mesma lógica de `set` se aplica aqui.
            cookieStore.set({ name, value: '', ...options })
          } catch {
            // Ignora o erro em contextos somente leitura.
          }
        },
      },
    }
  )
}
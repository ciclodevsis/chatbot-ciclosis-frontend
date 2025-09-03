// Caminho: app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // O 'next' é para onde o usuário será enviado após o login bem-sucedido
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Redireciona para uma página de erro se algo falhar
  console.error("Erro no callback de autenticação do Supabase.");
  return NextResponse.redirect(`${origin}/login?error=Authentication failed`)
}
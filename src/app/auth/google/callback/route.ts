// Caminho: app/auth/google/callback/route.ts
import { saveGoogleRefreshToken } from '@/lib/actions/google.actions';
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    // Troca o código pelo refresh_token e salva no banco
    const result = await saveGoogleRefreshToken(code);
    
    // Redireciona o usuário de volta para a página da agenda
    if (result.error) {
        return NextResponse.redirect(`${origin}/agenda?error=${result.error}`);
    }
    return NextResponse.redirect(`${origin}/agenda?success=true`);
  }
  
  // Se não houver código, redireciona com erro
  return NextResponse.redirect(`${origin}/agenda?error=google_auth_failed`);
}
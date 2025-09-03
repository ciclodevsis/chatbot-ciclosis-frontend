import { redirect } from 'next/navigation';

// Esta página redireciona o usuário para o primeiro documento
// quando ele acessa a URL base "/legal".
export default function LegalPage() {
  redirect('/legal/termos-de-uso');
}
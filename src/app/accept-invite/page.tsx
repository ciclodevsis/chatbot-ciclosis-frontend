// CAMINHO: app/accept-invite/page.tsx

import AcceptInviteForm from "./AcceptInviteForm";

// Este é um Componente de Servidor.
// Sua única responsabilidade é fornecer o layout e renderizar o componente cliente.
export default function AcceptInvitePage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <AcceptInviteForm />
    </main>
  );
}
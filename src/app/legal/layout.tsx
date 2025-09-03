import Link from "next/link";
import { LegalNav } from "./_components/LegalNav";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      {/* Cabeçalho simples */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-2xl font-bold">
            Chatbot<span className="text-brand-accent"> Ciclosis</span>
          </Link>
          <Link href="/" className="text-sm font-medium text-brand-accent hover:underline">
            Voltar para o site
          </Link>
        </div>
      </header>

      {/* Conteúdo principal com duas colunas */}
      <main className="container mx-auto flex gap-12 px-4 py-12">
        <aside className="w-1/4">
          <h2 className="mb-4 text-lg font-semibold">Navegação</h2>
          {/* O menu de navegação será um Componente Cliente para interatividade */}
          <LegalNav />
        </aside>
        <div className="flex-1">
          {/* O conteúdo de cada subpágina será renderizado aqui */}
          {children}
        </div>
      </main>
    </div>
  );
}
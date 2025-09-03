// src/app/layout.tsx (PADRONIZADO)

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Chatbot Ciclosis - Automatize seu Agendamento",
  description: "A plataforma completa para gerenciamento de agendamentos, clientes e comunicação.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.variable)}>
        {/* Este wrapper ajuda a estruturar a página e a posicionar o rodapé corretamente */}
        <div className="relative flex min-h-screen flex-col">
          {children}
        </div>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
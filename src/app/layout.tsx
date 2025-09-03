import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chatbot Ciclosis - Automatize seu Agendamento, Encante seus Clientes",
  description: "A plataforma completa para gerenciamento de agendamentos, clientes e comunicação.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className={`${inter.className} relative bg-slate-950 text-slate-200 overflow-x-hidden`}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/legal/termos-de-uso", label: "Termos de Uso" },
  { href: "/legal/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/legal/protecao-de-dados", label: "Proteção de Dados e Diretrizes" },
];

export function LegalNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="space-y-2">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-brand-accent text-white"
                  : "hover:bg-accent"
              )}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
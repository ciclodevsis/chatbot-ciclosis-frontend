"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Calendar, Users, Settings, LogOut, Clock, CreditCard } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/actions/auth.actions';
import type { User } from '@supabase/supabase-js';

export function Sidebar({ user }: { user: User }) {
  const pathname = usePathname();
  const userRole = user.user_metadata.role;

  // Itens de navegação base visíveis para todos
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/agenda', label: 'Agenda', icon: Calendar },
    { href: '/schedules', label: 'Agendamentos', icon: Clock },
  ];

  // Adiciona itens de navegação apenas para admins
  if (userRole === 'admin') {
    navItems.push(
      { href: '/staff', label: 'Equipe', icon: Users },
      { href: '/billing', label: 'Assinatura', icon: CreditCard }
    );
  }
  
  // Adiciona o item de configurações no final para todos
  navItems.push({ href: '/settings', label: 'Configurações', icon: Settings });

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 p-4 z-40">
      <div className="h-full w-full rounded-xl border bg-card shadow-subtle flex flex-col p-4">
        
        <div className="p-4 text-2xl font-bold text-brand-text">
          Chatbot<span className="text-brand-accent"> Ciclosis</span>
        </div>
        
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-base font-medium transition-all",
                    pathname.startsWith(item.href)
                      ? "bg-brand-accent text-white shadow-sm"
                      : "text-brand-text-secondary hover:bg-black/5"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-2 border-t border-card-border">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.user_metadata.avatar_url} alt="Avatar do usuário" />
                <AvatarFallback>{user.email?.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-brand-text truncate">{user.user_metadata.full_name || user.email}</p>
                <p className="text-xs text-brand-text-secondary capitalize">{userRole || 'Staff'}</p>
              </div>
            </div>
            
            <form action={signOut}>
              <Button type="submit" variant="ghost" size="icon" className="text-brand-text-secondary hover:text-brand-text hover:bg-black/5">
                  <LogOut className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
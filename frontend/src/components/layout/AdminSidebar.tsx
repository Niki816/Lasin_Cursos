'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  LogOut,
  GraduationCap,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/hooks/useAuth';

const items = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/cursos', label: 'Cursos', icon: BookOpen },
  {
    href: '/admin/preinscripciones',
    label: 'Preinscripciones',
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { usuario, logout } = useAuth();

  return (
    <aside className="w-64 bg-bg-secondary border-r border-border flex flex-col h-screen sticky top-0">
      <div className="h-16 px-6 flex items-center gap-2 border-b border-border">
        <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-lg shadow-brand-primary/30">
          <GraduationCap size={20} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-black text-text-primary leading-none">
            LASIN
          </p>
          <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
            Admin
          </p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                active
                  ? 'bg-brand-primary/15 text-brand-primary border border-brand-primary/30 shadow-sm'
                  : 'text-text-secondary hover:bg-bg-hover hover:text-text-primary'
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        {usuario && (
          <div className="px-3 py-2">
            <p className="text-xs text-text-muted uppercase font-bold tracking-wider">
              Sesión
            </p>
            <p className="text-sm font-bold text-text-primary truncate">
              {usuario.nombre}
            </p>
            <p className="text-xs text-text-secondary truncate">
              {usuario.email}
            </p>
          </div>
        )}
        <button
          onClick={() => logout('/')}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={16} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
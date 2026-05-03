'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Heart, User, Settings, LogOut, ChefHat } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Início', icon: Home },
  { href: '/favorites', label: 'Favoritos', icon: Heart },
  { href: '/profile', label: 'Perfil', icon: User },
];

export default function AppShell({
  children,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isAdmin?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-cream">
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 bg-white border-r border-stone-200 flex-col">
        <Link href="/dashboard" className="flex items-center gap-2 px-6 h-16 border-b border-stone-200">
          <ChefHat className="w-6 h-6 text-brand-600" />
          <span className="font-bold text-stone-900">Receitas Airfryer</span>
        </Link>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition',
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition',
                pathname.startsWith('/admin')
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              )}
            >
              <Settings className="w-5 h-5" />
              Admin
            </Link>
          )}
        </nav>
        <button
          onClick={handleLogout}
          className="m-4 flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-600 hover:bg-red-50 hover:text-red-700 transition"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </aside>

      <header className="md:hidden sticky top-0 z-30 bg-cream/90 backdrop-blur-md border-b border-stone-200">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-stone-900">
            <ChefHat className="w-5 h-5 text-brand-600" />
            Receitas Airfryer
          </Link>
          <button onClick={handleLogout} className="text-stone-500 p-2" aria-label="Sair">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="md:ml-64 pb-20 md:pb-0 min-h-screen">{children}</main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-stone-200 z-30">
        <div className={cn('grid', isAdmin ? 'grid-cols-4' : 'grid-cols-3')}>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition',
                  active ? 'text-brand-600' : 'text-stone-500'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                'flex flex-col items-center justify-center gap-1 py-2.5 text-xs font-medium transition',
                pathname.startsWith('/admin') ? 'text-brand-600' : 'text-stone-500'
              )}
            >
              <Settings className="w-5 h-5" />
              Admin
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import { ChefHat, Tags, Gift, FileText, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminHome() {
  const supabase = createClient();
  const [
    { count: recipesCount },
    { count: publishedCount },
    { count: categoriesCount },
    { count: bonusCount },
  ] = await Promise.all([
    supabase.from('recipes').select('*', { count: 'exact', head: true }),
    supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('status', 'publicada'),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('bonuses').select('*', { count: 'exact', head: true }),
  ]);

  const cards = [
    { href: '/admin/recipes', label: 'Receitas', icon: BookOpen, count: recipesCount ?? 0, hint: `${publishedCount ?? 0} publicadas` },
    { href: '/admin/categories', label: 'Categorias', icon: Tags, count: categoriesCount ?? 0, hint: 'Organize seu catálogo' },
    { href: '/admin/bonuses', label: 'Bônus', icon: Gift, count: bonusCount ?? 0, hint: 'Conteúdos extras' },
  ];

  return (
    <AppShell isAdmin>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900 flex items-center gap-2">
            <ChefHat className="w-8 h-8 text-brand-600" /> Painel Admin
          </h1>
          <p className="text-stone-600 mt-1">Gerencie receitas, categorias e bônus.</p>
        </header>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link key={c.href} href={c.href} className="card p-6 hover:-translate-y-0.5 transition-transform">
              <c.icon className="w-8 h-8 text-brand-600" />
              <div className="mt-4 text-3xl font-bold text-stone-900">{c.count}</div>
              <div className="text-stone-700 font-medium">{c.label}</div>
              <div className="text-sm text-stone-500 mt-1">{c.hint}</div>
            </Link>
          ))}
          <Link href="/admin/recipes/new" className="card p-6 border-2 border-dashed border-brand-300 hover:bg-brand-50 transition flex flex-col items-center justify-center text-brand-700">
            <FileText className="w-8 h-8" />
            <p className="mt-3 font-semibold">+ Nova receita</p>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

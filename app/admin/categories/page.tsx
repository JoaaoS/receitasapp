import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import CategoriesManager from '@/components/admin/CategoriesManager';
import type { Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');
  return (
    <AppShell isAdmin>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Categorias</h1>
        <p className="text-stone-600 mb-6">Crie e gerencie as categorias do catálogo.</p>
        <CategoriesManager initial={(categories as Category[]) ?? []} />
      </div>
    </AppShell>
  );
}

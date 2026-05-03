import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import RecipeGrid from '@/components/dashboard/RecipeGrid';
import type { Recipe, Category } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: recipes }, { data: categories }, { data: favorites }, { data: roleRow }] =
    await Promise.all([
      supabase
        .from('recipes')
        .select('*, category:categories(*)')
        .eq('status', 'publicada')
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
      supabase.from('favorites').select('recipe_id').eq('user_id', user?.id ?? ''),
      supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user?.id ?? '')
        .maybeSingle(),
    ]);

  const favIds = new Set((favorites ?? []).map((f) => f.recipe_id));
  const items: Recipe[] = (recipes ?? []).map((r: any) => ({
    ...r,
    is_favorite: favIds.has(r.id),
  }));
  const isAdmin = roleRow?.role === 'admin';

  return (
    <AppShell isAdmin={isAdmin}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-stone-900">Olá! 👋</h1>
          <p className="mt-1 text-stone-600">O que vamos preparar hoje?</p>
        </header>
        <RecipeGrid recipes={items} categories={(categories as Category[]) ?? []} />
      </div>
    </AppShell>
  );
}

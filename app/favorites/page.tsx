import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import RecipeCard from '@/components/dashboard/RecipeCard';
import { Heart } from 'lucide-react';
import type { Recipe } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function FavoritesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: favs } = await supabase
    .from('favorites')
    .select('recipe:recipes(*, category:categories(*))')
    .eq('user_id', user?.id ?? '')
    .order('created_at', { ascending: false });

  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  const recipes: Recipe[] = ((favs ?? []) as any[])
    .map((f) => f.recipe)
    .filter((r) => r && r.status === 'publicada')
    .map((r) => ({ ...r, is_favorite: true }));

  return (
    <AppShell isAdmin={roleRow?.role === 'admin'}>
      <div className="max-w-7xl mx-auto p-4 sm:p-6 md:p-10">
        <header className="mb-8 flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Seus favoritos</h1>
            <p className="text-stone-600">As receitas que você salvou ficam aqui.</p>
          </div>
        </header>

        {recipes.length === 0 ? (
          <div className="card p-10 text-center">
            <div className="text-5xl mb-3">💝</div>
            <p className="text-stone-700 font-medium">Você ainda não favoritou nenhuma receita.</p>
            <p className="text-stone-500 text-sm mt-1">
              Quando favoritar, elas aparecem aqui para acesso rápido.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {recipes.map((r) => (
              <RecipeCard key={r.id} recipe={r} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

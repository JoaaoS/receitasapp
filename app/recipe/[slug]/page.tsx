import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Users, BarChart3, Lightbulb } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import FavoriteButton from '@/components/dashboard/FavoriteButton';
import { difficultyLabel, difficultyColor } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function RecipeDetailPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: recipe } = await supabase
    .from('recipes')
    .select('*, category:categories(*)')
    .eq('slug', params.slug)
    .maybeSingle();

  if (!recipe || recipe.status !== 'publicada') notFound();

  const [{ data: fav }, { data: roleRow }] = await Promise.all([
    supabase
      .from('favorites')
      .select('recipe_id')
      .eq('user_id', user?.id ?? '')
      .eq('recipe_id', recipe.id)
      .maybeSingle(),
    supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user?.id ?? '')
      .maybeSingle(),
  ]);

  return (
    <AppShell isAdmin={roleRow?.role === 'admin'}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-brand-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="card overflow-hidden">
          {recipe.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={recipe.image_url} alt={recipe.title} className="w-full aspect-video object-cover" />
          ) : (
            <div className="w-full aspect-video flex items-center justify-center text-7xl bg-gradient-to-br from-brand-100 to-amber-100">
              🍽️
            </div>
          )}

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                {recipe.category?.name && (
                  <span className="badge bg-brand-100 text-brand-800 mb-3">
                    {recipe.category.emoji ? `${recipe.category.emoji} ` : ''}
                    {recipe.category.name}
                  </span>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">{recipe.title}</h1>
                {recipe.short_description && (
                  <p className="mt-2 text-stone-600">{recipe.short_description}</p>
                )}
              </div>
              <FavoriteButton recipeId={recipe.id} initial={!!fav} />
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-brand-50 p-3 text-center">
                <Clock className="w-5 h-5 mx-auto text-brand-600" />
                <div className="mt-1 text-xs text-stone-600">Tempo</div>
                <div className="font-semibold text-stone-900">{recipe.prep_time ?? '—'}</div>
              </div>
              <div className="rounded-xl bg-brand-50 p-3 text-center">
                <Users className="w-5 h-5 mx-auto text-brand-600" />
                <div className="mt-1 text-xs text-stone-600">Rendimento</div>
                <div className="font-semibold text-stone-900">{recipe.servings ?? '—'}</div>
              </div>
              <div className="rounded-xl bg-brand-50 p-3 text-center">
                <BarChart3 className="w-5 h-5 mx-auto text-brand-600" />
                <div className="mt-1 text-xs text-stone-600">Dificuldade</div>
                <div className={`badge ${difficultyColor(recipe.difficulty)} mt-0.5`}>
                  {difficultyLabel(recipe.difficulty)}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h2 className="text-lg font-bold text-stone-900 mb-3">Ingredientes</h2>
                <ul className="space-y-2">
                  {(recipe.ingredients ?? []).map((ing: string, i: number) => (
                    <li key={i} className="flex gap-3 text-stone-700">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-brand-500 flex-shrink-0" />
                      <span>{ing}</span>
                    </li>
                  ))}
                  {(recipe.ingredients ?? []).length === 0 && (
                    <li className="text-stone-400 text-sm">Sem ingredientes cadastrados.</li>
                  )}
                </ul>
              </div>
              <div>
                <h2 className="text-lg font-bold text-stone-900 mb-3">Modo de preparo</h2>
                <ol className="space-y-3">
                  {(recipe.instructions ?? []).map((step: string, i: number) => (
                    <li key={i} className="flex gap-3 text-stone-700">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-brand-600 text-white font-semibold text-sm flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                  {(recipe.instructions ?? []).length === 0 && (
                    <li className="text-stone-400 text-sm">Sem passos cadastrados.</li>
                  )}
                </ol>
              </div>
            </div>

            {recipe.tips && (
              <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-bold text-amber-900 flex items-center gap-2 mb-1">
                  <Lightbulb className="w-5 h-5" /> Dicas
                </h3>
                <p className="text-amber-900/80 whitespace-pre-line">{recipe.tips}</p>
              </div>
            )}

            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {recipe.tags.map((t: string) => (
                  <span key={t} className="badge bg-stone-100 text-stone-700">#{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

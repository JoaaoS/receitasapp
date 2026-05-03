import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import RecipeForm from '@/components/admin/RecipeForm';
import type { Category, Recipe } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function EditRecipePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: recipe }, { data: categories }] = await Promise.all([
    supabase.from('recipes').select('*').eq('id', params.id).maybeSingle(),
    supabase.from('categories').select('*').order('name'),
  ]);

  if (!recipe) notFound();

  return (
    <AppShell isAdmin>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10">
        <h1 className="text-3xl font-bold text-stone-900 mb-6">Editar receita</h1>
        <RecipeForm categories={(categories as Category[]) ?? []} recipe={recipe as Recipe} />
      </div>
    </AppShell>
  );
}

import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import { Plus, Edit3 } from 'lucide-react';
import DeleteRecipeButton from '@/components/admin/DeleteRecipeButton';

export const dynamic = 'force-dynamic';

export default async function AdminRecipesPage() {
  const supabase = createClient();
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*, category:categories(name, emoji)')
    .order('created_at', { ascending: false });

  return (
    <AppShell isAdmin>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Receitas</h1>
            <p className="text-stone-600">Crie, edite e publique receitas.</p>
          </div>
          <Link href="/admin/recipes/new" className="btn-primary">
            <Plus className="w-4 h-4" /> Nova receita
          </Link>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-stone-50 text-stone-600 text-left">
                <tr>
                  <th className="p-3">Título</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {(recipes ?? []).map((r: any) => (
                  <tr key={r.id} className="border-t border-stone-100">
                    <td className="p-3 font-medium text-stone-900">{r.title}</td>
                    <td className="p-3 text-stone-600">
                      {r.category ? `${r.category.emoji ?? ''} ${r.category.name}` : '—'}
                    </td>
                    <td className="p-3">
                      {r.status === 'publicada' ? (
                        <span className="badge bg-green-100 text-green-800">Publicada</span>
                      ) : (
                        <span className="badge bg-stone-100 text-stone-700">Rascunho</span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <div className="inline-flex items-center gap-2">
                        <Link href={`/admin/recipes/${r.id}`} className="btn-ghost text-sm">
                          <Edit3 className="w-4 h-4" /> Editar
                        </Link>
                        <DeleteRecipeButton id={r.id} />
                      </div>
                    </td>
                  </tr>
                ))}
                {(recipes ?? []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-10 text-center text-stone-500">
                      Nenhuma receita ainda. Crie a primeira!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

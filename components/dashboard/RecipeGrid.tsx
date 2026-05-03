'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { Recipe, Category } from '@/lib/types';
import RecipeCard from './RecipeCard';

export default function RecipeGrid({
  recipes,
  categories,
}: {
  recipes: Recipe[];
  categories: Category[];
}) {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = search.trim().toLowerCase();
    return recipes.filter((r) => {
      if (activeCat && r.category_id !== activeCat) return false;
      if (!s) return true;
      const haystack = [r.title, r.short_description ?? '', ...(r.tags ?? [])]
        .join(' ')
        .toLowerCase();
      return haystack.includes(s);
    });
  }, [recipes, search, activeCat]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar receita..."
          className="input pl-11"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        <button
          onClick={() => setActiveCat(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition border ${
            !activeCat
              ? 'bg-brand-600 text-white border-brand-600'
              : 'bg-white text-stone-700 border-stone-200 hover:border-brand-300'
          }`}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition border ${
              activeCat === c.id
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-stone-700 border-stone-200 hover:border-brand-300'
            }`}
          >
            {c.emoji ? `${c.emoji} ` : ''}
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card p-10 text-center text-stone-500">
          <div className="text-4xl mb-2">🔎</div>
          Nenhuma receita encontrada com esses filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((r) => (
            <RecipeCard key={r.id} recipe={r} />
          ))}
        </div>
      )}
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2, Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { Recipe, Category } from '@/lib/types';

type Props = { categories: Category[]; recipe?: Recipe };

export default function RecipeForm({ categories, recipe }: Props) {
  const router = useRouter();
  const isEdit = !!recipe;

  const [title, setTitle] = useState(recipe?.title ?? '');
  const [shortDescription, setShortDescription] = useState(recipe?.short_description ?? '');
  const [imageUrl, setImageUrl] = useState(recipe?.image_url ?? '');
  const [categoryId, setCategoryId] = useState(recipe?.category_id ?? '');
  const [prepTime, setPrepTime] = useState(recipe?.prep_time ?? '');
  const [servings, setServings] = useState(recipe?.servings ?? '');
  const [difficulty, setDifficulty] = useState(recipe?.difficulty ?? 'facil');
  const [ingredients, setIngredients] = useState<string[]>(
    recipe?.ingredients?.length ? recipe.ingredients : ['']
  );
  const [instructions, setInstructions] = useState<string[]>(
    recipe?.instructions?.length ? recipe.instructions : ['']
  );
  const [tips, setTips] = useState(recipe?.tips ?? '');
  const [tagsRaw, setTagsRaw] = useState((recipe?.tags ?? []).join(', '));
  const [status, setStatus] = useState(recipe?.status ?? 'rascunho');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function updateArrayItem(arr: string[], setter: (a: string[]) => void, i: number, val: string) {
    const next = [...arr];
    next[i] = val;
    setter(next);
  }
  function addItem(arr: string[], setter: (a: string[]) => void) {
    setter([...arr, '']);
  }
  function removeItem(arr: string[], setter: (a: string[]) => void, i: number) {
    setter(arr.filter((_, idx) => idx !== i));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const payload: any = {
      title: title.trim(),
      short_description: shortDescription.trim() || null,
      image_url: imageUrl.trim() || null,
      category_id: categoryId || null,
      prep_time: prepTime.trim() || null,
      servings: servings.trim() || null,
      difficulty,
      ingredients: ingredients.map((i) => i.trim()).filter(Boolean),
      instructions: instructions.map((i) => i.trim()).filter(Boolean),
      tips: tips.trim() || null,
      tags: tagsRaw.split(',').map((t) => t.trim()).filter(Boolean),
      status,
    };

    if (isEdit) {
      const { error } = await supabase.from('recipes').update(payload).eq('id', recipe!.id);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    } else {
      payload.slug = slugify(title) + '-' + Date.now().toString(36);
      const { error } = await supabase.from('recipes').insert(payload);
      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }
    }

    router.push('/admin/recipes');
    router.refresh();
  }

  return (
    <form onSubmit={save} className="space-y-6">
      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Título *</label>
          <input required className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Descrição curta</label>
          <textarea rows={2} className="input" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">URL da imagem</label>
          <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="preview" className="mt-2 w-full max-w-xs rounded-xl object-cover aspect-video" />
          )}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Categoria</label>
            <select className="input" value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">Sem categoria</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.emoji ? `${c.emoji} ` : ''}{c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Dificuldade</label>
            <select className="input" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
              <option value="facil">Fácil</option>
              <option value="medio">Médio</option>
              <option value="dificil">Difícil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Tempo de preparo</label>
            <input className="input" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} placeholder="Ex: 25 min" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Rendimento</label>
            <input className="input" value={servings} onChange={(e) => setServings(e.target.value)} placeholder="Ex: 4 porções" />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-stone-900 mb-3">Ingredientes</h3>
        <div className="space-y-2">
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input className="input" value={ing} onChange={(e) => updateArrayItem(ingredients, setIngredients, i, e.target.value)} placeholder={`Ingrediente ${i + 1}`} />
              <button type="button" onClick={() => removeItem(ingredients, setIngredients, i)} className="px-3 rounded-xl text-red-500 hover:bg-red-50" aria-label="Remover">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => addItem(ingredients, setIngredients)} className="btn-secondary mt-3 text-sm">
          <Plus className="w-4 h-4" /> Adicionar ingrediente
        </button>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold text-stone-900 mb-3">Modo de preparo</h3>
        <div className="space-y-2">
          {instructions.map((step, i) => (
            <div key={i} className="flex gap-2">
              <span className="flex-shrink-0 mt-2 w-7 h-7 rounded-full bg-brand-600 text-white text-sm flex items-center justify-center">{i + 1}</span>
              <textarea rows={2} className="input" value={step} onChange={(e) => updateArrayItem(instructions, setInstructions, i, e.target.value)} placeholder="Descreva o passo" />
              <button type="button" onClick={() => removeItem(instructions, setInstructions, i)} className="px-3 rounded-xl text-red-500 hover:bg-red-50" aria-label="Remover">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => addItem(instructions, setInstructions)} className="btn-secondary mt-3 text-sm">
          <Plus className="w-4 h-4" /> Adicionar passo
        </button>
      </div>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Dicas</label>
          <textarea rows={3} className="input" value={tips} onChange={(e) => setTips(e.target.value)} placeholder="Dicas opcionais..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Tags (separadas por vírgula)</label>
          <input className="input" value={tagsRaw} onChange={(e) => setTagsRaw(e.target.value)} placeholder="rapida, low-carb, fitness" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="rascunho">Rascunho (não aparece para usuários)</option>
            <option value="publicada">Publicada (visível na plataforma)</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
      )}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : isEdit ? 'Salvar alterações' : 'Criar receita'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">Cancelar</button>
      </div>
    </form>
  );
}

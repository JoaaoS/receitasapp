'use client';

import { useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { Category } from '@/lib/types';

export default function CategoriesManager({ initial }: { initial: Category[] }) {
  const [items, setItems] = useState<Category[]>(initial);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: name.trim(),
        slug: slugify(name),
        emoji: emoji.trim() || null,
        description: description.trim() || null,
      })
      .select()
      .single();
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setItems((arr) => [...arr, data as Category].sort((a, b) => a.name.localeCompare(b.name)));
    setName('');
    setEmoji('');
    setDescription('');
  }

  async function remove(id: string) {
    if (!confirm('Excluir esta categoria? Receitas ficarão sem categoria.')) return;
    const supabase = createClient();
    await supabase.from('categories').delete().eq('id', id);
    setItems((arr) => arr.filter((c) => c.id !== id));
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card p-6 space-y-3">
        <h3 className="font-semibold text-stone-900">Nova categoria</h3>
        <div className="grid sm:grid-cols-[1fr,80px] gap-3">
          <input required className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome (ex: Sobremesas)" />
          <input className="input text-center" value={emoji} onChange={(e) => setEmoji(e.target.value)} placeholder="🍰" maxLength={3} />
        </div>
        <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição (opcional)" />
        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
        )}
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Adicionar
        </button>
      </form>

      <div className="card overflow-hidden">
        <ul className="divide-y divide-stone-100">
          {items.map((c) => (
            <li key={c.id} className="flex items-center justify-between p-4">
              <div>
                <div className="font-medium text-stone-900">
                  {c.emoji ? `${c.emoji} ` : ''}{c.name}
                </div>
                {c.description && <div className="text-sm text-stone-500">{c.description}</div>}
              </div>
              <button onClick={() => remove(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" aria-label="Excluir">
                <Trash2 className="w-4 h-4" />
              </button>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-8 text-center text-stone-500">Nenhuma categoria ainda.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

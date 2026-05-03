'use client';

import { useState } from 'react';
import { Loader2, Plus, Trash2, Edit3, Check, X, ExternalLink } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { Bonus } from '@/lib/types';

export default function BonusesManager({ initial }: { initial: Bonus[] }) {
  const [items, setItems] = useState<Bonus[]>(initial);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  function resetForm() {
    setTitle('');
    setDescription('');
    setImageUrl('');
    setLinkUrl('');
    setOrderIndex(0);
    setActive(true);
    setEditingId(null);
    setError(null);
  }

  function startEdit(b: Bonus) {
    setEditingId(b.id);
    setTitle(b.title);
    setDescription(b.description ?? '');
    setImageUrl(b.image_url ?? '');
    setLinkUrl(b.link_url ?? '');
    setOrderIndex(b.order_index);
    setActive(b.active);
    setError(null);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();

    const payload = {
      title: title.trim(),
      description: description.trim() || null,
      image_url: imageUrl.trim() || null,
      link_url: linkUrl.trim() || null,
      order_index: Number.isFinite(orderIndex) ? orderIndex : 0,
      active,
    };

    if (editingId) {
      const { data, error } = await supabase
        .from('bonuses')
        .update(payload)
        .eq('id', editingId)
        .select()
        .single();
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setItems((arr) =>
        arr.map((b) => (b.id === editingId ? (data as Bonus) : b)).sort((a, b) => a.order_index - b.order_index)
      );
      resetForm();
    } else {
      const { data, error } = await supabase.from('bonuses').insert(payload).select().single();
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      setItems((arr) => [...arr, data as Bonus].sort((a, b) => a.order_index - b.order_index));
      resetForm();
    }
  }

  async function toggleActive(b: Bonus) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('bonuses')
      .update({ active: !b.active })
      .eq('id', b.id)
      .select()
      .single();
    if (!error && data) {
      setItems((arr) => arr.map((x) => (x.id === b.id ? (data as Bonus) : x)));
    }
  }

  async function remove(id: string) {
    if (!confirm('Excluir este bônus?')) return;
    const supabase = createClient();
    await supabase.from('bonuses').delete().eq('id', id);
    setItems((arr) => arr.filter((b) => b.id !== id));
    if (editingId === id) resetForm();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-stone-900">{editingId ? 'Editar bônus' : 'Novo bônus'}</h3>
          {editingId && (
            <button type="button" onClick={resetForm} className="text-sm text-stone-500 hover:text-stone-800 inline-flex items-center gap-1">
              <X className="w-4 h-4" /> Cancelar edição
            </button>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Título *</label>
          <input required className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Plano semanal de refeições" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Descrição</label>
          <textarea rows={2} className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve explicação sobre o bônus" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">URL da imagem</label>
            <input className="input" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">URL do conteúdo</label>
            <input className="input" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://..." />
          </div>
        </div>

        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="preview" className="w-full max-w-xs rounded-xl object-cover aspect-video" />
        )}

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Ordem (menor aparece primeiro)</label>
            <input type="number" className="input" value={orderIndex} onChange={(e) => setOrderIndex(parseInt(e.target.value || '0', 10))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Status</label>
            <select className="input" value={active ? 'active' : 'inactive'} onChange={(e) => setActive(e.target.value === 'active')}>
              <option value="active">Ativo (visível)</option>
              <option value="inactive">Inativo (oculto)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
        )}

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : editingId ? (
            <><Check className="w-4 h-4" /> Salvar alterações</>
          ) : (
            <><Plus className="w-4 h-4" /> Adicionar bônus</>
          )}
        </button>
      </form>

      <div className="card overflow-hidden">
        <ul className="divide-y divide-stone-100">
          {items.map((b) => (
            <li key={b.id} className="p-4 flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-brand-100 flex items-center justify-center flex-shrink-0">
                {b.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={b.image_url} alt={b.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">🎁</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-stone-900">{b.title}</p>
                  <span className={`badge ${b.active ? 'bg-green-100 text-green-800' : 'bg-stone-100 text-stone-600'}`}>
                    {b.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <span className="text-xs text-stone-400">ordem: {b.order_index}</span>
                </div>
                {b.description && (
                  <p className="text-sm text-stone-600 mt-1 line-clamp-2">{b.description}</p>
                )}
                {b.link_url && (
                  <a href={b.link_url} target="_blank" rel="noreferrer" className="text-xs text-brand-700 inline-flex items-center gap-1 mt-1 hover:underline">
                    <ExternalLink className="w-3 h-3" /> Abrir conteúdo
                  </a>
                )}
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => toggleActive(b)} className="text-xs px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50">
                  {b.active ? 'Desativar' : 'Ativar'}
                </button>
                <button onClick={() => startEdit(b)} className="p-2 rounded-lg text-stone-600 hover:bg-stone-50" aria-label="Editar">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => remove(b.id)} className="p-2 rounded-lg text-red-500 hover:bg-red-50" aria-label="Excluir">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </li>
          ))}
          {items.length === 0 && (
            <li className="p-8 text-center text-stone-500">Nenhum bônus ainda. Adicione o primeiro acima!</li>
          )}
        </ul>
      </div>
    </div>
  );
}

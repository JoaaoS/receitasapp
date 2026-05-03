'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function ProfileForm({
  email,
  fullName,
  avatarUrl,
}: {
  email: string;
  fullName: string;
  avatarUrl: string;
}) {
  const [name, setName] = useState(fullName);
  const [avatar, setAvatar] = useState(avatarUrl);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    await supabase
      .from('profiles')
      .update({ full_name: name, avatar_url: avatar || null })
      .eq('id', user.id);
    setLoading(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <form onSubmit={save} className="card p-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-brand-100 overflow-hidden flex items-center justify-center text-3xl">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            '👤'
          )}
        </div>
        <div>
          <p className="font-medium text-stone-900">{name || 'Sem nome'}</p>
          <p className="text-sm text-stone-500">{email}</p>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nome completo</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">URL do avatar</label>
        <input className="input" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
      </div>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : saved ? (
          <><Check className="w-4 h-4" /> Salvo</>
        ) : (
          'Salvar alterações'
        )}
      </button>
    </form>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function FavoriteButton({
  recipeId,
  initial,
}: {
  recipeId: string;
  initial: boolean;
}) {
  const [active, setActive] = useState(initial);
  const [, startTransition] = useTransition();

  async function toggle() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const next = !active;
    setActive(next);
    startTransition(async () => {
      if (next) {
        await supabase.from('favorites').insert({ user_id: user.id, recipe_id: recipeId });
      } else {
        await supabase.from('favorites').delete().eq('user_id', user.id).eq('recipe_id', recipeId);
      }
    });
  }

  return (
    <button
      onClick={toggle}
      aria-label={active ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className={`w-11 h-11 rounded-full flex items-center justify-center border transition flex-shrink-0 ${
        active
          ? 'bg-red-50 border-red-200 text-red-500'
          : 'bg-white border-stone-200 text-stone-400 hover:text-red-500'
      }`}
    >
      <Heart className={`w-5 h-5 ${active ? 'fill-red-500' : ''}`} />
    </button>
  );
}

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function DeleteRecipeButton({ id }: { id: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    startTransition(async () => {
      const supabase = createClient();
      await supabase.from('recipes').delete().eq('id', id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className={`btn-ghost text-sm ${
        confirming ? 'text-white bg-red-600 hover:bg-red-700' : 'text-red-600'
      }`}
    >
      {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
      {confirming ? 'Confirmar?' : 'Excluir'}
    </button>
  );
}

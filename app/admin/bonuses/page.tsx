import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import BonusesManager from '@/components/admin/BonusesManager';
import type { Bonus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminBonusesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('bonuses')
    .select('*')
    .order('order_index', { ascending: true });
  return (
    <AppShell isAdmin>
      <div className="max-w-3xl mx-auto p-4 sm:p-6 md:p-10">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Bônus / Conteúdos extras</h1>
        <p className="text-stone-600 mb-6">Adicione e-books, planilhas, vídeos e materiais extras.</p>
        <BonusesManager initial={(data as Bonus[]) ?? []} />
      </div>
    </AppShell>
  );
}

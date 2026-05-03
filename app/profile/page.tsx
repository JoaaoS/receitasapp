import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/dashboard/AppShell';
import ProfileForm from '@/components/dashboard/ProfileForm';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id ?? '')
    .maybeSingle();
  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  return (
    <AppShell isAdmin={roleRow?.role === 'admin'}>
      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-10">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Seu perfil</h1>
        <p className="text-stone-600 mb-6">Mantenha suas informações atualizadas.</p>
        <ProfileForm
          email={user?.email ?? ''}
          fullName={profile?.full_name ?? ''}
          avatarUrl={profile?.avatar_url ?? ''}
        />
      </div>
    </AppShell>
  );
}

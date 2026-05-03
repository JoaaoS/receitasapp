'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChefHat, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginInner() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('E-mail ou senha incorretos.');
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 to-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md card p-8">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 text-stone-900">
          <ChefHat className="w-7 h-7 text-brand-600" />
          <span className="font-bold text-lg">Receitas Airfryer</span>
        </Link>
        <h1 className="text-2xl font-bold text-stone-900 text-center">Bem-vindo de volta</h1>
        <p className="text-stone-600 text-center mt-1 mb-6">Entre na sua conta para continuar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Ainda não tem conta?{' '}
          <Link href="/signup" className="text-brand-700 font-semibold hover:underline">Criar conta</Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginInner />
    </Suspense>
  );
}

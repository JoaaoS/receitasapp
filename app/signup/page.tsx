'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChefHat, Loader2, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('A senha precisa ter no mínimo 6 caracteres.');
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    if (data.session) {
      router.push('/dashboard');
      router.refresh();
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-brand-50 to-cream flex items-center justify-center p-4">
        <div className="w-full max-w-md card p-8 text-center">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-stone-900">Conta criada!</h1>
          <p className="text-stone-600 mt-2">Confirme seu e-mail para liberar o acesso à plataforma.</p>
          <Link href="/login" className="btn-primary w-full mt-6">Ir para o login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-brand-50 to-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md card p-8">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6 text-stone-900">
          <ChefHat className="w-7 h-7 text-brand-600" />
          <span className="font-bold text-lg">Receitas Airfryer</span>
        </Link>
        <h1 className="text-2xl font-bold text-stone-900 text-center">Criar sua conta</h1>
        <p className="text-stone-600 text-center mt-1 mb-6">É rápido e gratuito para começar</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Nome</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="Como podemos te chamar?" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">E-mail</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="seu@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Senha</label>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Mínimo 6 caracteres" />
          </div>
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm p-3">{error}</div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Criar conta'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-600">
          Já tem uma conta?{' '}
          <Link href="/login" className="text-brand-700 font-semibold hover:underline">Entrar</Link>
        </p>
      </div>
    </main>
  );
}

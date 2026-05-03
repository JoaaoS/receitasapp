import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-cream/80 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-stone-900">
          <ChefHat className="w-6 h-6 text-brand-600" />
          Receitas Airfryer
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link href="/login" className="btn-ghost">Entrar</Link>
          <Link href="/signup" className="btn-primary px-4 py-2 text-sm sm:text-base">Criar conta</Link>
        </nav>
      </div>
    </header>
  );
}

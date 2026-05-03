import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-50 via-cream to-amber-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.12),_transparent_60%)]" />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Plataforma exclusiva de membros
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1]">
            Receitas práticas e saborosas{' '}
            <span className="text-brand-600">na sua airfryer</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-stone-600 leading-relaxed max-w-2xl">
            Centenas de receitas organizadas em categorias, com modo de preparo passo a passo,
            tempo, rendimento e dicas. Acesse de qualquer dispositivo, a qualquer hora.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/signup" className="btn-primary text-base px-8 py-4">
              Começar agora <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="btn-secondary text-base px-8 py-4">
              Já tenho conta
            </Link>
          </div>
          <p className="mt-6 text-sm text-stone-500">
            ✓ Acesso imediato &nbsp; ✓ Funciona no celular &nbsp; ✓ Atualizações constantes
          </p>
        </div>
      </div>
    </section>
  );
}

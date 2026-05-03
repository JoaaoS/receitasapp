import Link from 'next/link';
import { Check, ArrowRight } from 'lucide-react';

const features = [
  'Acesso completo ao catálogo de receitas',
  'Novos pratos adicionados todo mês',
  'Bônus exclusivos para membros',
  'Funciona no celular, tablet e computador',
  'Busca por nome, categoria e tags',
  'Salve seus favoritos para acessar depois',
];

export default function Pricing() {
  return (
    <section className="py-20 sm:py-24 bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Acesso vitalício, pagamento único
          </h2>
          <p className="mt-4 text-stone-600 text-lg">
            Sem mensalidade. Você paga uma vez e usa para sempre.
          </p>
        </div>
        <div className="card border-2 border-brand-300 p-8 sm:p-10 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-brand-600 text-white text-xs font-bold uppercase tracking-wide">
            Plano completo
          </div>
          <div className="text-center mb-8">
            <p className="text-stone-600">de R$ 197 por apenas</p>
            <div className="flex items-baseline justify-center gap-1 mt-1">
              <span className="text-2xl font-bold text-stone-700">R$</span>
              <span className="text-6xl font-bold text-brand-600">47</span>
              <span className="text-stone-600">,00</span>
            </div>
            <p className="text-sm text-stone-500 mt-2">pagamento único</p>
          </div>
          <ul className="space-y-3 mb-8">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3" />
                </span>
                <span className="text-stone-700">{f}</span>
              </li>
            ))}
          </ul>
          <Link href="/signup" className="btn-primary w-full text-base py-4">
            Quero garantir meu acesso <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-center text-xs text-stone-500 mt-4">
            Pagamento seguro · Acesso liberado imediatamente
          </p>
        </div>
      </div>
    </section>
  );
}

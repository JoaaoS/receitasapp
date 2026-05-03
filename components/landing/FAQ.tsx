'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  { q: 'Como funciona o acesso à plataforma?', a: 'Após criar sua conta, você recebe acesso imediato ao catálogo. É só fazer login pelo navegador do celular ou computador a qualquer hora.' },
  { q: 'Preciso instalar algum app?', a: 'Não. A plataforma funciona direto no navegador, é responsiva e foi feita pensando no uso pelo celular. Você pode adicionar o atalho na tela inicial.' },
  { q: 'As receitas são realmente para airfryer?', a: 'Sim. Todas as receitas foram pensadas para serem feitas na airfryer, com tempo, temperatura e modo de preparo adaptados.' },
  { q: 'Vou conseguir seguir as receitas mesmo sem experiência?', a: 'Com certeza. As receitas são explicadas em passo a passo simples, com ingredientes do dia a dia.' },
  { q: 'Posso pedir reembolso se não gostar?', a: 'Pode sim. Você tem 7 dias de garantia total. Se não curtir, basta nos enviar um e-mail que devolvemos seu dinheiro.' },
  { q: 'Vou receber novas receitas depois da compra?', a: 'Sim. Adicionamos receitas novas todo mês na sua área de membros, sem custo adicional.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-20 sm:py-24 bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">Perguntas frequentes</h2>
          <p className="mt-4 text-stone-600 text-lg">
            Tirou sua dúvida? Boa! Se ainda restar alguma, fale com a gente.
          </p>
        </div>
        <div className="space-y-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="card overflow-hidden">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-brand-50/50 transition"
                >
                  <span className="font-semibold text-stone-900">{item.q}</span>
                  <span className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center flex-shrink-0">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {isOpen && <div className="px-5 pb-5 text-stone-700 leading-relaxed">{item.a}</div>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

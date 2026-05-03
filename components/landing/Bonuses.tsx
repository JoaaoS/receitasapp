import { Gift, Calendar, ListChecks, FileText } from 'lucide-react';

const bonuses = [
  { icon: Calendar, title: 'Plano semanal de refeições', text: 'Modelo pronto para você organizar a semana em poucos minutos.' },
  { icon: ListChecks, title: 'Lista de compras inteligente', text: 'Checklist por categoria para nunca esquecer nada no mercado.' },
  { icon: FileText, title: 'Guia de tempos e temperaturas', text: 'Tabela completa de tempo e temperatura por tipo de alimento.' },
  { icon: Gift, title: 'Receitas exclusivas mensais', text: 'Novas receitas adicionadas todo mês para a sua área de membros.' },
];

export default function Bonuses() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-br from-brand-600 to-accent-600 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-sm font-medium mb-4">
            🎁 Conteúdos extras
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold">Bônus que vão facilitar sua rotina</h2>
          <p className="mt-4 text-white/85 text-lg">
            Além das receitas, você ganha materiais de apoio para usar no dia a dia.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {bonuses.map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <Icon className="w-8 h-8 mb-4" />
              <h3 className="font-semibold text-lg">{title}</h3>
              <p className="mt-2 text-white/85 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

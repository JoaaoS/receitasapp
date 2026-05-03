import { Clock, Heart, Smartphone, Search, BookOpen, Award } from 'lucide-react';

const items = [
  { icon: Clock, title: 'Receitas rápidas', text: 'Pratos prontos em poucos minutos para o seu dia corrido.' },
  { icon: Heart, title: 'Mais saudáveis', text: 'Menos óleo, mesma textura crocante que você adora.' },
  { icon: Smartphone, title: 'No seu bolso', text: 'Plataforma 100% responsiva, acesse pelo celular ou desktop.' },
  { icon: Search, title: 'Busca inteligente', text: 'Encontre o que cozinhar pelo nome, ingrediente ou categoria.' },
  { icon: BookOpen, title: 'Passo a passo claro', text: 'Modo de preparo escrito de forma simples para qualquer pessoa seguir.' },
  { icon: Award, title: 'Conteúdo selecionado', text: 'Cada receita é revisada e organizada para facilitar sua vida.' },
];

export default function Benefits() {
  return (
    <section className="py-20 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Tudo que você precisa para cozinhar melhor
          </h2>
          <p className="mt-4 text-stone-600 text-lg">
            Uma plataforma pensada para quem quer comer bem sem perder tempo.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <div className="w-12 h-12 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
              <p className="mt-2 text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

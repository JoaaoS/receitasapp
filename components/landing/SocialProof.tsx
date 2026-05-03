import { Users, ChefHat, Star } from 'lucide-react';

export default function SocialProof() {
  return (
    <section className="py-16 bg-white border-y border-stone-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Users className="w-8 h-8 text-brand-600 mb-3" />
            <div className="text-3xl font-bold text-stone-900">+10 mil</div>
            <p className="text-stone-600">membros ativos cozinhando</p>
          </div>
          <div className="flex flex-col items-center">
            <ChefHat className="w-8 h-8 text-brand-600 mb-3" />
            <div className="text-3xl font-bold text-stone-900">+400</div>
            <p className="text-stone-600">receitas testadas e revisadas</p>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-8 h-8 text-brand-600 mb-3 fill-brand-600" />
            <div className="text-3xl font-bold text-stone-900">4,9 / 5</div>
            <p className="text-stone-600">média de avaliação dos usuários</p>
          </div>
        </div>
      </div>
    </section>
  );
}

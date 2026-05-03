import { ShieldCheck } from 'lucide-react';

export default function Guarantee() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="card border-2 border-green-200 bg-green-50/50 p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-green-100 text-green-700 flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-stone-900">
              Garantia incondicional de 7 dias
            </h3>
            <p className="mt-2 text-stone-700">
              Teste a plataforma sem compromisso. Se em até 7 dias você não amar o conteúdo,
              basta enviar um e-mail e devolvemos 100% do seu investimento. Sem perguntas.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

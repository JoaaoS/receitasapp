const categories = [
  { name: 'Carnes', emoji: '🥩' },
  { name: 'Aves', emoji: '🍗' },
  { name: 'Peixes', emoji: '🐟' },
  { name: 'Vegetais', emoji: '🥦' },
  { name: 'Lanches', emoji: '🥪' },
  { name: 'Sobremesas', emoji: '🍰' },
  { name: 'Salgados', emoji: '🥟' },
  { name: 'Café da manhã', emoji: '🥞' },
  { name: 'Massas', emoji: '🍝' },
  { name: 'Low Carb', emoji: '🥗' },
];

export default function Categories() {
  return (
    <section className="py-20 sm:py-24 bg-gradient-to-b from-cream to-brand-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900">
            Categorias para qualquer ocasião
          </h2>
          <p className="mt-4 text-stone-600 text-lg">
            Do almoço de domingo ao lanche da tarde, tem receita para todo dia.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((c) => (
            <div key={c.name} className="card p-6 text-center hover:-translate-y-1 transition-transform">
              <div className="text-4xl mb-3">{c.emoji}</div>
              <p className="font-semibold text-stone-800">{c.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

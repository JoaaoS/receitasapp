export function slugify(text: string): string {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function difficultyLabel(d: string): string {
  const map: Record<string, string> = { facil: 'Fácil', medio: 'Médio', dificil: 'Difícil' };
  return map[d] ?? d;
}

export function difficultyColor(d: string): string {
  const map: Record<string, string> = {
    facil: 'bg-green-100 text-green-800',
    medio: 'bg-yellow-100 text-yellow-800',
    dificil: 'bg-red-100 text-red-800',
  };
  return map[d] ?? 'bg-gray-100 text-gray-800';
}

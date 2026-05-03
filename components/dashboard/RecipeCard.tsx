import Link from 'next/link';
import { Clock, BarChart3, Heart } from 'lucide-react';
import type { Recipe } from '@/lib/types';
import { difficultyLabel, difficultyColor } from '@/lib/utils';

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link
      href={`/recipe/${recipe.slug}`}
      className="card group block hover:-translate-y-0.5 transition-transform"
    >
      <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
        {recipe.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl bg-gradient-to-br from-brand-100 to-amber-100">
            🍽️
          </div>
        )}
        {recipe.is_favorite && (
          <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </span>
        )}
        {recipe.category?.name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-medium text-stone-800 shadow">
            {recipe.category.emoji ? `${recipe.category.emoji} ` : ''}
            {recipe.category.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 line-clamp-2 leading-snug">
          {recipe.title}
        </h3>
        {recipe.short_description && (
          <p className="mt-1 text-sm text-stone-500 line-clamp-2">{recipe.short_description}</p>
        )}
        <div className="mt-3 flex items-center gap-3 text-xs text-stone-600">
          {recipe.prep_time && (
            <span className="inline-flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {recipe.prep_time}
            </span>
          )}
          <span className={`badge ${difficultyColor(recipe.difficulty)}`}>
            <BarChart3 className="w-3 h-3" />
            {difficultyLabel(recipe.difficulty)}
          </span>
        </div>
      </div>
    </Link>
  );
}

export type Difficulty = 'facil' | 'medio' | 'dificil';
export type RecipeStatus = 'rascunho' | 'publicada';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  emoji: string | null;
  description: string | null;
  created_at: string;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  image_url: string | null;
  category_id: string | null;
  prep_time: string | null;
  servings: string | null;
  difficulty: Difficulty;
  ingredients: string[];
  instructions: string[];
  tips: string | null;
  tags: string[];
  status: RecipeStatus;
  created_at: string;
  updated_at: string;
  category?: Category | null;
  is_favorite?: boolean;
}

export interface Bonus {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  order_index: number;
  active: boolean;
  created_at: string;
}

export interface Favorite {
  user_id: string;
  recipe_id: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  role: 'admin' | 'user';
}

-- =========================================================================
-- SCHEMA SUPABASE - APP DE RECEITAS AIRFRYER
-- Execute este arquivo no SQL Editor do Supabase Dashboard
-- =========================================================================
create extension if not exists "uuid-ossp";

-- user_roles primeiro (trigger depende dela)
create table if not exists public.user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('admin','user')),
  created_at timestamptz not null default now()
);
alter table public.user_roles enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
$$;

-- profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  insert into public.user_roles (user_id, role)
  values (new.id, 'user')
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- categories
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  emoji text,
  description text,
  created_at timestamptz not null default now()
);
alter table public.categories enable row level security;

-- recipes
create table if not exists public.recipes (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  short_description text,
  image_url text,
  category_id uuid references public.categories(id) on delete set null,
  prep_time text,
  servings text,
  difficulty text not null default 'facil' check (difficulty in ('facil','medio','dificil')),
  ingredients text[] not null default '{}',
  instructions text[] not null default '{}',
  tips text,
  tags text[] not null default '{}',
  status text not null default 'rascunho' check (status in ('rascunho','publicada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.recipes enable row level security;
create index if not exists recipes_status_idx on public.recipes(status);
create index if not exists recipes_category_idx on public.recipes(category_id);
create index if not exists recipes_title_idx on public.recipes using gin (to_tsvector('portuguese', title));

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

drop trigger if exists recipes_updated_at on public.recipes;
create trigger recipes_updated_at
  before update on public.recipes
  for each row execute function public.set_updated_at();

-- favorites
create table if not exists public.favorites (
  user_id uuid not null references auth.users(id) on delete cascade,
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);
alter table public.favorites enable row level security;

-- bonuses
create table if not exists public.bonuses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  image_url text,
  link_url text,
  order_index int not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);
alter table public.bonuses enable row level security;

-- POLÍTICAS RLS
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "user_roles_select_own" on public.user_roles;
create policy "user_roles_select_own" on public.user_roles
  for select using (auth.uid() = user_id or public.is_admin());

drop policy if exists "user_roles_admin_manage" on public.user_roles;
create policy "user_roles_admin_manage" on public.user_roles
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (true);

drop policy if exists "categories_admin_write" on public.categories;
create policy "categories_admin_write" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "recipes_user_read_published" on public.recipes;
create policy "recipes_user_read_published" on public.recipes
  for select using (status = 'publicada' or public.is_admin());

drop policy if exists "recipes_admin_write" on public.recipes;
create policy "recipes_admin_write" on public.recipes
  for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "favorites_select_own" on public.favorites;
create policy "favorites_select_own" on public.favorites
  for select using (auth.uid() = user_id);

drop policy if exists "favorites_insert_own" on public.favorites;
create policy "favorites_insert_own" on public.favorites
  for insert with check (auth.uid() = user_id);

drop policy if exists "favorites_delete_own" on public.favorites;
create policy "favorites_delete_own" on public.favorites
  for delete using (auth.uid() = user_id);

drop policy if exists "bonuses_public_read" on public.bonuses;
create policy "bonuses_public_read" on public.bonuses
  for select using (active = true or public.is_admin());

drop policy if exists "bonuses_admin_write" on public.bonuses;
create policy "bonuses_admin_write" on public.bonuses
  for all using (public.is_admin()) with check (public.is_admin());

-- DADOS INICIAIS
insert into public.categories (name, slug, emoji, description) values
  ('Carnes','carnes','🥩','Cortes suculentos preparados na airfryer'),
  ('Aves','aves','🍗','Frango e outras aves crocantes por fora'),
  ('Peixes e Frutos do Mar','peixes-e-frutos-do-mar','🐟','Pescados leves e saborosos'),
  ('Vegetais e Legumes','vegetais-e-legumes','🥦','Receitas saudáveis com legumes'),
  ('Lanches Rápidos','lanches-rapidos','🥪','Para o dia a dia corrido'),
  ('Sobremesas','sobremesas','🍰','Doces fit feitos na airfryer'),
  ('Salgados','salgados','🥟','Coxinhas, esfihas, pastéis e mais'),
  ('Café da Manhã','cafe-da-manha','🥞','Comece o dia bem'),
  ('Massas','massas','🍝','Macarrão e afins'),
  ('Low Carb','low-carb','🥗','Receitas com baixo carboidrato')
on conflict (slug) do nothing;

-- COMO TORNAR ADMIN:
-- 1. Crie a conta normalmente pelo /signup
-- 2. Pegue o UUID em Authentication → Users
-- 3. Execute: update public.user_roles set role='admin' where user_id='COLE_O_UUID';

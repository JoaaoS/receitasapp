# 🍳 Receitas Airfryer — Plataforma de Membros

Plataforma própria de receitas para airfryer no estilo área de membros premium, construída com **Next.js 14**, **React**, **Tailwind CSS** e **Supabase**, pronta para deploy na **DigitalOcean App Platform**.

---

## ✨ Visão geral

- **Landing page comercial** com hero, benefícios, categorias, prova social, bônus, oferta, garantia, FAQ e rodapé.
- **Área logada (estilo HuskyApp)** com dashboard de receitas, busca, filtros por categoria, favoritos, perfil, sidebar no desktop e menu inferior no mobile.
- **Painel admin (`/admin`)** para criar, editar, excluir e publicar receitas, gerenciar categorias e bônus, com imagens via URL.
- **Auth completa via Supabase** com Row-Level Security (RLS): cada usuário só vê o que pode, admin tem acesso total, receitas em rascunho ficam ocultas até serem publicadas.

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 (App Router) |
| UI | React 18 + Tailwind CSS 3 |
| Ícones | lucide-react |
| Auth + DB | Supabase (Postgres + RLS) |
| SDK Supabase | `@supabase/ssr` (cookies SSR) |
| Deploy | DigitalOcean App Platform |
| Linguagem | TypeScript |

---

## 📁 Estrutura de pastas

```
airfryer-app/
├── app/
│   ├── layout.tsx                    # Layout raiz
│   ├── page.tsx                      # Landing page
│   ├── globals.css                   # Estilos globais + Tailwind
│   ├── login/page.tsx                # Login
│   ├── signup/page.tsx               # Cadastro
│   ├── dashboard/page.tsx            # Catálogo de receitas (logado)
│   ├── recipe/[slug]/page.tsx        # Detalhe da receita
│   ├── favorites/page.tsx            # Favoritos do usuário
│   ├── profile/page.tsx              # Perfil
│   └── admin/
│       ├── page.tsx                  # Dashboard admin
│       ├── recipes/page.tsx          # Listagem
│       ├── recipes/new/page.tsx      # Criar receita
│       ├── recipes/[id]/page.tsx     # Editar receita
│       ├── categories/page.tsx       # Gerenciar categorias
│       └── bonuses/page.tsx          # Gerenciar bônus
├── components/
│   ├── landing/                      # 9 componentes da landing
│   ├── dashboard/                    # AppShell, RecipeCard, RecipeGrid, FavoriteButton, ProfileForm
│   └── admin/                        # RecipeForm, CategoriesManager, BonusesManager, DeleteRecipeButton
├── lib/
│   ├── supabase/                     # client, server, middleware
│   ├── types.ts                      # tipos TypeScript do banco
│   └── utils.ts                      # slugify, cn, helpers
├── supabase/
│   └── schema.sql                    # Schema completo do banco
├── middleware.ts                     # Proteção de rotas
├── package.json
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── .env.example
```

---

## 🚀 Setup local

### 1. Clonar e instalar

```bash
git clone <seu-repo>
cd airfryer-app
npm install
```

### 2. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz copiando do `.env.example`:

```bash
cp .env.example .env.local
```

Preencha com os dados do seu projeto Supabase (passo 3):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Rodar em dev

```bash
npm run dev
```

Acesse `http://localhost:3000`.

---

## 🗄️ Configurar o Supabase

### Passo 1 — Criar o projeto

1. Acesse [supabase.com](https://supabase.com) e crie uma conta.
2. Clique em **New project**, escolha nome, senha do banco e região (use `South America (São Paulo)` para latência baixa no Brasil).
3. Aguarde alguns minutos até o projeto ficar pronto.

### Passo 2 — Rodar o schema SQL

1. No painel do Supabase, vá em **SQL Editor** → **New query**.
2. Abra o arquivo `supabase/schema.sql` deste repositório, copie todo o conteúdo e cole no editor.
3. Clique em **Run**. Isso cria todas as tabelas (`profiles`, `recipes`, `categories`, `favorites`, `bonuses`, `user_roles`), as políticas RLS, os triggers e as 10 categorias iniciais.

### Passo 3 — Pegar as chaves

1. Vá em **Project Settings** → **API**.
2. Copie:
   - **Project URL** → vira `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → vira `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Passo 4 — Configurar URLs de auth

Em **Authentication** → **URL Configuration**:

- **Site URL**: `https://seu-dominio.com` (em produção) ou `http://localhost:3000` (dev)
- **Redirect URLs**: adicione `http://localhost:3000/**` e `https://seu-dominio.com/**`

### Passo 5 — Confirmação de e-mail (opcional)

Por padrão o Supabase exige confirmação de e-mail. Para liberar acesso imediato em testes, vá em **Authentication** → **Providers** → **Email** e desative **Confirm email**.

### Passo 6 — Tornar você admin

1. Crie sua conta normalmente em `/signup`.
2. Pegue seu UUID em **Authentication** → **Users** (coluna `UID`).
3. Volte ao **SQL Editor** e rode:

```sql
update public.user_roles set role = 'admin' where user_id = 'COLE_SEU_UUID_AQUI';
```

4. Faça logout e login de novo. Agora você verá o item **Admin** na navegação.

---

## 🐙 Subir para o GitHub

```bash
cd airfryer-app
git init
git add .
git commit -m "feat: app inicial de receitas airfryer"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/airfryer-app.git
git push -u origin main
```

⚠️ **Não comite o `.env.local`** — ele já está no `.gitignore`.

---

## ☁️ Deploy na DigitalOcean App Platform

### Passo 1 — Criar o app

1. Acesse [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps) e clique em **Create App**.
2. Escolha **GitHub** como source, conecte sua conta e selecione o repositório `airfryer-app`.
3. Branch: `main`. **Autodeploy**: ativado.

### Passo 2 — Configurar o serviço web

A plataforma detecta o Next.js. Confirme os campos:

| Campo | Valor |
|---|---|
| Type | Web Service |
| Build Command | `npm run build` |
| Run Command | `npm start` |
| HTTP Port | `3000` |
| Instance Size | Basic ($5/mês já é suficiente para começar) |

### Passo 3 — Variáveis de ambiente

Em **Environment Variables**, adicione (todas como `RUN_AND_BUILD_TIME`):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
NEXT_PUBLIC_SITE_URL=https://seu-app.ondigitalocean.app
```

> **Importante:** por usarem prefixo `NEXT_PUBLIC_`, elas precisam estar disponíveis no build, não só em runtime. Marque o tipo como build + run time.

### Passo 4 — Domínio

- Use o domínio gratuito `*.ondigitalocean.app` ou
- Conecte um domínio próprio em **Settings** → **Domains** (você adiciona um CNAME no seu provedor de DNS).

### Passo 5 — Atualizar Supabase com o domínio final

Volte no Supabase em **Authentication** → **URL Configuration** e adicione o domínio de produção em **Site URL** e em **Redirect URLs**.

### Passo 6 — Deploy

Clique em **Create Resources**. O primeiro build leva ~3-5 minutos. A cada `git push origin main`, a DigitalOcean roda o build e atualiza automaticamente.

---

## 📝 Como adicionar receitas

1. Acesse `https://seu-dominio.com/login` e entre com sua conta admin.
2. Clique em **Admin** no menu lateral (ou no menu inferior se estiver no celular).
3. Clique em **+ Nova receita**.
4. Preencha:
   - **Título** (obrigatório)
   - **Descrição curta** que aparece no card
   - **URL da imagem** — cole um link de imagem hospedada (Imgur, Cloudinary, Unsplash, etc.)
   - **Categoria, dificuldade, tempo, rendimento**
   - **Ingredientes** — um por linha, use o botão `+` para adicionar mais
   - **Modo de preparo** — um passo por linha, numerados automaticamente
   - **Dicas** (opcional)
   - **Tags** — separadas por vírgula, ex: `rapida, fitness, low-carb`
   - **Status**: deixe em **Rascunho** enquanto edita, mude para **Publicada** quando estiver pronta
5. Clique em **Criar receita**.

A receita publicada aparece imediatamente no dashboard de todos os usuários logados.

### Gerenciar categorias

`/admin/categories` — adicione novas categorias com nome, emoji e descrição. As categorias aparecem como filtros no dashboard.

### Gerenciar bônus

`/admin/bonuses` — cadastre conteúdos extras (e-books, planilhas, vídeos) com título, descrição, imagem, link, ordem de exibição e status ativo/inativo.

### Promover outro usuário a admin

```sql
update public.user_roles set role = 'admin' where user_id = 'UUID_DO_USUARIO';
```

Para revogar:

```sql
update public.user_roles set role = 'user' where user_id = 'UUID_DO_USUARIO';
```

---

## 🔐 Modelo de segurança (RLS)

Todas as tabelas têm Row-Level Security ativada:

| Tabela | Usuário comum | Admin |
|---|---|---|
| `profiles` | lê e edita o próprio | lê todos |
| `user_roles` | lê o próprio | gerencia tudo |
| `categories` | só leitura | CRUD completo |
| `recipes` | lê apenas `status='publicada'` | CRUD completo |
| `favorites` | CRUD apenas dos próprios | — |
| `bonuses` | lê apenas `active=true` | CRUD completo |

A função `is_admin()` no Postgres é usada nas policies — segura mesmo se alguém tentar chamar a API do Supabase direto pelo navegador.

O `middleware.ts` reforça a proteção a nível de rota: `/admin/*` exige role admin, demais rotas protegidas exigem login.

---

## 🛠️ Comandos úteis

```bash
npm run dev      # ambiente de desenvolvimento (http://localhost:3000)
npm run build    # build de produção
npm start        # rodar build de produção
npm run lint     # verificar problemas de código
```

---

## 🎨 Personalização

### Cores

Edite `tailwind.config.ts`. A paleta `brand` controla o laranja principal — troque os valores hex e todo o app reflete a mudança.

### Textos da landing

Cada seção é um arquivo separado em `components/landing/`. Edite os textos diretamente nos componentes (Hero, Benefits, Categories, etc.).

### Logo

A logo atual é o ícone `ChefHat` da `lucide-react`. Para colocar uma imagem, substitua nos arquivos:
- `components/landing/Navbar.tsx`
- `components/landing/Footer.tsx`
- `components/dashboard/AppShell.tsx`
- `app/login/page.tsx` e `app/signup/page.tsx`

---

## 📬 Suporte

- Documentação Next.js: https://nextjs.org/docs
- Documentação Supabase: https://supabase.com/docs
- Documentação DigitalOcean App Platform: https://docs.digitalocean.com/products/app-platform/

Bom código e boas receitas! 🍳

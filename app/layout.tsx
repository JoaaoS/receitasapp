import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Receitas Airfryer | Sua cozinha mais prática',
  description: 'Plataforma premium de receitas práticas, saudáveis e saborosas para sua airfryer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-cream text-stone-900 antialiased">{children}</body>
    </html>
  );
}

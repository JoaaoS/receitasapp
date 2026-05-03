import Link from 'next/link';
import { ChefHat } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <ChefHat className="w-6 h-6 text-brand-400" />
              Receitas Airfryer
            </div>
            <p className="mt-3 text-sm text-stone-400 leading-relaxed">
              Plataforma premium de receitas práticas para airfryer.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Plataforma</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-white">Entrar</Link></li>
              <li><Link href="/signup" className="hover:text-white">Criar conta</Link></li>
              <li><Link href="/dashboard" className="hover:text-white">Área de membros</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/termos" className="hover:text-white">Termos de uso</Link></li>
              <li><Link href="/privacidade" className="hover:text-white">Política de privacidade</Link></li>
              <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Suporte</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:contato@seusite.com" className="hover:text-white">contato@seusite.com</a></li>
              <li>Atendimento em horário comercial</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-stone-800 text-sm text-stone-500 flex flex-col sm:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} Receitas Airfryer. Todos os direitos reservados.</span>
          <span>Feito com 🧡 para a sua cozinha</span>
        </div>
      </div>
    </footer>
  );
}

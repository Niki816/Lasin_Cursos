import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-2">Página no encontrada</h2>
        <p className="text-text-secondary mb-8">
          La página que buscas no existe o fue movida.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 gradient-brand rounded-xl font-bold text-white transition-transform hover:scale-105"
          >
            <Home size={18} />
            Ir al inicio
          </Link>
          <Link
            href="/cursos"
            className="inline-flex items-center gap-2 px-6 py-3 glass rounded-xl font-bold transition-colors hover:bg-white/10"
          >
            <Search size={18} />
            Ver cursos
          </Link>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Error en la aplicación:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={40} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Algo salió mal</h1>
        <p className="text-text-secondary mb-8">
          Ha ocurrido un error inesperado. Por favor, intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 gradient-brand rounded-xl font-bold text-white transition-transform hover:scale-105"
        >
          <RefreshCw size={18} />
          Reintentar
        </button>
      </div>
    </div>
  );
}
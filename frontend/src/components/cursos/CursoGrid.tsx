'use client';

import { BookOpen } from 'lucide-react';
import { CursoCard } from './CursoCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { FullPageSpinner } from '@/components/ui/Spinner';
import type { Curso } from '@/types/curso.types';

interface CursoGridProps {
  cursos: Curso[];
  loading?: boolean;
}

export function CursoGrid({ cursos, loading }: CursoGridProps) {
  if (loading) {
    return <FullPageSpinner label="Cargando cursos..." />;
  }

  if (cursos.length === 0) {
    return (
      <EmptyState
        icon={<BookOpen size={56} />}
        title="No hay cursos disponibles"
        description="Vuelve más tarde para ver los nuevos cursos publicados."
      />
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {cursos.map((curso) => (
        <CursoCard key={curso.id} curso={curso} />
      ))}
    </div>
  );
}
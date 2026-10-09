'use client';

import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PreinscripcionTable } from '@/components/preinscripciones/PreinscripcionTable';
import { useCurso } from '@/hooks/useCursos';

export default function PreinscripcionesCursoPage({
  params,
}: {
  params: Promise<{ cursoId: string }>;
}) {
  const { cursoId } = use(params);
  const { curso, loading } = useCurso(Number(cursoId));

  if (loading) return <Spinner size="lg" label="Cargando..." />;
  if (!curso) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Curso no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <Link href="/admin/preinscripciones">
        <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />}>
          Volver
        </Button>
      </Link>

      <div>
        <h1 className="text-3xl font-black mb-1">Preinscripciones</h1>
        <p className="text-text-secondary">{curso.nombre}</p>
      </div>

      <PreinscripcionTable cursoId={curso.id} cursoNombre={curso.nombre} />
    </div>
  );
}
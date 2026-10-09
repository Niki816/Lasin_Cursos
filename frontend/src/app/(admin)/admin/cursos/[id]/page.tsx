'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CursoForm } from '@/components/cursos/CursoForm';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCurso, useCursos } from '@/hooks/useCursos';
import type { CursoFormData } from '@/types/curso.types';

export default function EditarCursoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { curso, loading } = useCurso(Number(id));
  const { actualizar } = useCursos({ autoFetch: false });
  const [saving, setSaving] = useState(false);

  if (loading) return <Spinner size="lg" label="Cargando curso..." />;
  if (!curso) {
    return (
      <div className="text-center py-20">
        <p className="text-text-secondary">Curso no encontrado.</p>
      </div>
    );
  }

  const handleSubmit = async (data: CursoFormData) => {
    setSaving(true);
    try {
      await actualizar(Number(id), data);
      router.push('/admin/cursos');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          icon={<ArrowLeft size={16} />}
          onClick={() => router.back()}
        >
          Volver
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-black mb-1">Editar Curso</h1>
        <p className="text-text-secondary">{curso.nombre}</p>
      </div>

      <CursoForm
        initialData={curso}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        loading={saving}
      />
    </div>
  );
}
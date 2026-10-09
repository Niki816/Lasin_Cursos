'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { CursoForm } from '@/components/cursos/CursoForm';
import { Button } from '@/components/ui/Button';
import { useCursos } from '@/hooks/useCursos';

export default function NuevoCursoPage() {
  const router = useRouter();
  const { crear } = useCursos({ autoFetch: false });

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
        <h1 className="text-3xl font-black mb-1">Nuevo Curso</h1>
        <p className="text-text-secondary">
          Completa la información del curso.
        </p>
      </div>

      <CursoForm
        onSubmit={async (data) => {
          await crear(data);
          router.push('/admin/cursos');
        }}
        onCancel={() => router.back()}
      />
    </div>
  );
}
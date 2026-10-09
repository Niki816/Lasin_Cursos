'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Plus, Edit, Trash2, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';
import { useCursos } from '@/hooks/useCursos';
import { formatearMonto, formatearFecha } from '@/lib/utils/format';

export default function AdminCursosPage() {
  const { cursos, loading, eliminar } = useCursos();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const cursoAEliminar = cursos.find((c) => c.id === deleteId);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await eliminar(deleteId);
      setDeleteId(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1">Cursos</h1>
          <p className="text-text-secondary">
            Gestiona el catálogo de cursos disponibles.
          </p>
        </div>
        <Link href="/admin/cursos/nuevo">
          <Button variant="primary" icon={<Plus size={16} />}>
            Nuevo Curso
          </Button>
        </Link>
      </div>

      {loading ? (
        <Spinner size="lg" label="Cargando cursos..." />
      ) : cursos.length === 0 ? (
        <EmptyState
          icon={<BookOpen size={56} />}
          title="Aún no hay cursos"
          description="Crea el primero haciendo click en 'Nuevo Curso'."
          action={
            <Link href="/admin/cursos/nuevo">
              <Button variant="primary" icon={<Plus size={16} />}>
                Crear Curso
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
            <Card key={curso.id} hover>
              <CardBody className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold text-text-primary line-clamp-2">
                    {curso.nombre}
                  </h3>
                  {curso.publicado ? (
                    <Badge variant="aceptado" size="sm">
                      Publicado
                    </Badge>
                  ) : (
                    <Badge size="sm">Borrador</Badge>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-text-secondary">
                  {curso.modalidad && <p>💻 {curso.modalidad}</p>}
                  {curso.fechaInicio && (
                    <p>📅 {formatearFecha(curso.fechaInicio)}</p>
                  )}
                  {curso._count && (
                    <p className="flex items-center gap-1">
                      <Users size={12} />
                      {curso._count.preinscripciones} preinscritos
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <span className="font-bold text-brand-primary">
                    {formatearMonto(curso.costo)}
                  </span>
                  <div className="flex gap-1">
                    <Link href={`/admin/cursos/${curso.id}`}>
                      <button
                        className="p-2 rounded-lg text-brand-primary hover:bg-brand-primary/10 transition-colors"
                        title="Editar"
                      >
                        <Edit size={15} />
                      </button>
                    </Link>
                    <button
                      onClick={() => setDeleteId(curso.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="¿Eliminar curso?"
        description={`Se eliminará "${cursoAEliminar?.nombre}" y todas sus preinscripciones asociadas. Esta acción no se puede deshacer.`}
        confirmText="Sí, eliminar"
        loading={deleting}
      />
    </div>
  );
}
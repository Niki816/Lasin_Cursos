'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/shared/EmptyState';
import { useCursos } from '@/hooks/useCursos';

export default function AdminPreinscripcionesPage() {
  const { cursos, loading } = useCursos();

  if (loading) return <Spinner size="lg" label="Cargando cursos..." />;

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black mb-1">Preinscripciones</h1>
        <p className="text-text-secondary">
          Selecciona un curso para ver y gestionar sus preinscripciones.
        </p>
      </div>

      {cursos.length === 0 ? (
        <EmptyState
          icon={<Users size={56} />}
          title="No hay cursos"
          description="Crea un curso primero para recibir preinscripciones."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {cursos.map((curso) => (
            <Link key={curso.id} href={`/admin/preinscripciones/${curso.id}`}>
              <Card hover className="cursor-pointer">
                <CardBody>
                  <h3 className="font-bold text-text-primary mb-3 line-clamp-2">
                    {curso.nombre}
                  </h3>
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <Badge variant="primary">
                      {curso._count?.preinscripciones || 0} preinscritos
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
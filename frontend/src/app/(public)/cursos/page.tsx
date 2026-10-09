'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { CursoGrid } from '@/components/cursos/CursoGrid';
import { SearchBar } from '@/components/shared/SearchBar';
import { useCursos } from '@/hooks/useCursos';

export default function CursosPage() {
  const [search, setSearch] = useState('');
  const { cursos, loading } = useCursos({ publicado: true });

  const filtered = useMemo(() => {
    if (!search) return cursos;
    const term = search.toLowerCase();
    return cursos.filter(
      (c) =>
        c.nombre.toLowerCase().includes(term) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(term))
    );
  }, [cursos, search]);

  return (
    <div className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Explora Nuestros <span className="gradient-text">Cursos</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Encuentra el curso perfecto para impulsar tu carrera profesional.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-10">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar por nombre o descripción..."
          />
          {search && (
            <p className="text-center text-xs text-text-muted mt-3">
              {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para
              "{search}"
            </p>
          )}
        </div>

        <CursoGrid cursos={filtered} loading={loading} />
      </div>
    </div>
  );
}
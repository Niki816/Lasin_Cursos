'use client';

import { useCallback, useEffect, useState } from 'react';
import { cursosApi } from '@/lib/api/cursos.api';
import type { Curso, CursoFormData } from '@/types/curso.types';
import { toast } from 'sonner';

interface UseCursosOptions {
  publicado?: boolean;
  autoFetch?: boolean;
}

export function useCursos(options: UseCursosOptions = {}) {
  const { publicado, autoFetch = true } = options;

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCursos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cursosApi.listar({ publicado });
      setCursos(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [publicado]);

  useEffect(() => {
    if (autoFetch) fetchCursos();
  }, [autoFetch, fetchCursos]);

const crear = async (payload: CursoFormData) => {
  // Verificar token antes de enviar
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (!token) {
      const error = new Error('Debes iniciar sesión para crear cursos');
      toast.error(error.message);
      throw error;
    }
  }

  const nuevo = await cursosApi.crear(payload);
  setCursos((prev) => [nuevo, ...prev]);
  toast.success('Curso creado correctamente');
  return nuevo;
};

  const actualizar = async (id: number, payload: Partial<CursoFormData>) => {
    // Verificar token antes de enviar
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        const error = new Error('Debes iniciar sesión para actualizar cursos');
        toast.error(error.message);
        throw error;
      }
    }

    const actualizado = await cursosApi.actualizar(id, payload);
    setCursos((prev) => prev.map((c) => (c.id === id ? actualizado : c)));
    toast.success('Curso actualizado correctamente');
    return actualizado;
  };

  const eliminar = async (id: number) => {
    // Verificar token antes de enviar
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        const error = new Error('Debes iniciar sesión para eliminar cursos');
        toast.error(error.message);
        throw error;
      }
    }

    await cursosApi.eliminar(id);
    setCursos((prev) => prev.filter((c) => c.id !== id));
    toast.success('Curso eliminado');
  };

  return {
    cursos,
    loading,
    error,
    refetch: fetchCursos,
    crear,
    actualizar,
    eliminar,
  };
}

/**
 * Hook para obtener un curso individual
 */
export function useCurso(id: number | null) {
  const [curso, setCurso] = useState<Curso | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCurso = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await cursosApi.obtener(id);
        setCurso(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Error desconocido';
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchCurso();
  }, [id]);

  return { curso, loading, error };
}
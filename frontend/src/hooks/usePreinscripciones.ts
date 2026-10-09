'use client';

import { useCallback, useEffect, useState } from 'react';
import { preinscripcionesApi } from '@/lib/api/preinscripciones.api';
import type {
  Preinscripcion,
  EstadoPreinscripcion,
} from '@/types/preinscripcion.types';
import { toast } from 'sonner';

interface UsePreinscripcionesOptions {
  cursoId?: number;
  estado?: EstadoPreinscripcion;
  search?: string;
  autoFetch?: boolean;
}

export function usePreinscripciones(
  options: UsePreinscripcionesOptions = {}
) {
  const { cursoId, estado, search, autoFetch = true } = options;

  const [preinscripciones, setPreinscripciones] = useState<Preinscripcion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreinscripciones = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await preinscripcionesApi.listar({
        cursoId,
        estado,
        search,
      });
      setPreinscripciones(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error desconocido';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [cursoId, estado, search]);

  useEffect(() => {
    if (autoFetch) fetchPreinscripciones();
  }, [autoFetch, fetchPreinscripciones]);

  const cambiarEstado = async (
    id: number,
    nuevoEstado: EstadoPreinscripcion,
    observacion?: string
  ) => {
    const actualizada = await preinscripcionesApi.cambiarEstado(
      id,
      nuevoEstado,
      observacion
    );
    setPreinscripciones((prev) =>
      prev.map((p) => (p.id === id ? actualizada : p))
    );
    toast.success('Estado actualizado');
    return actualizada;
  };

  const actualizarComprobante = async (id: number, file: File) => {
    const actualizada = await preinscripcionesApi.actualizarComprobante(
      id,
      file
    );
    setPreinscripciones((prev) =>
      prev.map((p) => (p.id === id ? actualizada : p))
    );
    toast.success('Comprobante actualizado');
    return actualizada;
  };

  return {
    preinscripciones,
    loading,
    error,
    refetch: fetchPreinscripciones,
    cambiarEstado,
    actualizarComprobante,
  };
}
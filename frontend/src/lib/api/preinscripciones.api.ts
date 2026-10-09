import apiClient from './axios';
import type {
  Preinscripcion,
  PreinscripcionFormData,
  EstadoPreinscripcion,
} from '@/types/preinscripcion.types';

interface ListarPreinscripcionesResponse {
  status: 'ok';
  total: number;
  preinscripciones: Preinscripcion[];
}

interface PreinscripcionResponse {
  status: 'ok' | 'duplicado';
  message?: string;
  preinscripcion?: Preinscripcion;
}

function buildFormData(data: PreinscripcionFormData): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (key === 'comprobante' && value instanceof File) {
      formData.append('comprobante', value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export const preinscripcionesApi = {
  async crear(
    payload: PreinscripcionFormData
  ): Promise<PreinscripcionResponse> {
    const formData = buildFormData(payload);
    const { data } = await apiClient.post<PreinscripcionResponse>(
      '/preinscripciones',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  },

  async listar(params?: {
    cursoId?: number;
    estado?: EstadoPreinscripcion;
    search?: string;
  }): Promise<Preinscripcion[]> {
    const { data } = await apiClient.get<ListarPreinscripcionesResponse>(
      '/preinscripciones',
      { params }
    );
    return data.preinscripciones;
  },

  async obtener(id: number): Promise<Preinscripcion> {
    const { data } = await apiClient.get<{ preinscripcion: Preinscripcion }>(
      `/preinscripciones/${id}`
    );
    return data.preinscripcion;
  },

  async cambiarEstado(
    id: number,
    estado: EstadoPreinscripcion,
    observacion?: string
  ): Promise<Preinscripcion> {
    const { data } = await apiClient.patch<{ preinscripcion: Preinscripcion }>(
      `/preinscripciones/${id}/estado`,
      { estado, observacion }
    );
    return data.preinscripcion;
  },

  async actualizarComprobante(
    id: number,
    file: File
  ): Promise<Preinscripcion> {
    const formData = new FormData();
    formData.append('comprobante', file);
    const { data } = await apiClient.patch<{ preinscripcion: Preinscripcion }>(
      `/preinscripciones/${id}/comprobante`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data.preinscripcion;
  },
};
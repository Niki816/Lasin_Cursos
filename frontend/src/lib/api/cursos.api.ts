import apiClient from './axios';
import type { Curso, CursoFormData } from '@/types/curso.types';

interface ListarCursosResponse {
  status: 'ok';
  total: number;
  cursos: Curso[];
}

interface CursoResponse {
  status: 'ok';
  curso: Curso;
}

/**
 * Convierte un objeto de datos + archivo a FormData para subir a backend
 */
function buildFormData(data: Partial<CursoFormData>): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') return;
    if (key === 'afiche' && value instanceof File) {
      formData.append('afiche', value);
    } else {
      formData.append(key, String(value));
    }
  });

  return formData;
}

export const cursosApi = {
  async listar(params?: { publicado?: boolean }): Promise<Curso[]> {
    const { data } = await apiClient.get<ListarCursosResponse>('/cursos', {
      params,
    });
    return data.cursos;
  },

  async obtener(id: number): Promise<Curso> {
    const { data } = await apiClient.get<CursoResponse>(`/cursos/${id}`);
    return data.curso;
  },

  async crear(payload: CursoFormData): Promise<Curso> {
    const formData = buildFormData(payload);
    const { data } = await apiClient.post<CursoResponse>('/cursos', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.curso;
  },

  async actualizar(id: number, payload: Partial<CursoFormData>): Promise<Curso> {
    const formData = buildFormData(payload);
    const { data } = await apiClient.put<CursoResponse>(
      `/cursos/${id}`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return data.curso;
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/cursos/${id}`);
  },

  async actualizarWhatsapp(id: number, enlaceWhatsapp: string): Promise<Curso> {
    const { data } = await apiClient.patch<CursoResponse>(
      `/cursos/${id}/whatsapp`,
      { enlaceWhatsapp }
    );
    return data.curso;
  },
};
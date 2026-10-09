export type EstadoPreinscripcion = 'pendiente' | 'aceptado' | 'rechazado';

export interface Preinscripcion {
  id: number;
  cursoId: number;
  correo: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string | null;
  telefono: string | null;
  ci: string | null;
  institucionEstudios: string | null;
  observaciones: string | null;
  comprobanteUrl: string | null;
  comprobantePublicId: string | null;
  estado: EstadoPreinscripcion;
  createdAt: string;
  updatedAt: string;
  curso?: {
    id: number;
    nombre: string;
    costo: string | number;
  };
}

export interface PreinscripcionFormData {
  cursoId: number;
  correo: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  telefono?: string | null;
  ci?: string | null;
  institucionEstudios?: string | null;
  observaciones?: string | null;
  comprobante?: File | null;
}
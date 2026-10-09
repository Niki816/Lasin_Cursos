import { z } from 'zod';

export const cursoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  nivel: z.string().optional().nullable(),
  modalidad: z.string().optional().nullable(),
  fechaInicio: z.string().optional().nullable(),
  fechaFin: z.string().optional().nullable(),
  horaInicio: z.string().optional().nullable(),
  horaFin: z.string().optional().nullable(),
  duracion: z.string().optional().nullable(),
  costo: z.coerce.number().min(0, 'El costo no puede ser negativo').default(0),
  color: z
    .string()
    .regex(/^#[0-9A-F]{6}$/i, 'Color inválido')
    .optional()
    .nullable(),
  descripcion: z.string().optional().nullable(),
  totalHoras: z.coerce.number().int().min(0).optional().nullable(),
  instructor: z.string().optional().nullable(),
  contenido: z.string().optional().nullable(),
  requisitosPrevios: z.string().optional().nullable(),
  enlaceWhatsapp: z
    .string()
    .url('Debe ser una URL válida')
    .optional()
    .nullable()
    .or(z.literal('')),
});

export type CursoFormInput = z.infer<typeof cursoSchema>;
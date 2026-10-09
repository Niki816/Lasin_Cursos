import { z } from 'zod';

export const preinscripcionSchema = z.object({
  cursoId: z.coerce.number().int().positive(),
  correo: z.string().email('Email inválido'),
  nombres: z.string().min(2, 'Nombres muy cortos'),
  apellidoPaterno: z.string().min(2, 'Apellido muy corto'),
  apellidoMaterno: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  ci: z.string().optional().nullable(),
  institucionEstudios: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

export type PreinscripcionFormInput = z.infer<typeof preinscripcionSchema>;
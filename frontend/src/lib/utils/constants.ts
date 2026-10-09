export const ESTADOS_PREINSCRIPCION = [
  { value: 'pendiente', label: 'Pendiente', emoji: '⏳', color: 'amber' },
  { value: 'aceptado', label: 'Aceptado', emoji: '✅', color: 'emerald' },
  { value: 'rechazado', label: 'Rechazado', emoji: '❌', color: 'red' },
] as const;

export const MODALIDADES = [
  { value: 'PRESENCIAL', label: 'Presencial' },
  { value: 'VIRTUAL', label: 'Virtual' },
  { value: 'HIBRIDA', label: 'Híbrida' },
] as const;

export const NIVELES = [
  { value: 'BASICO', label: 'Básico' },
  { value: 'INTERMEDIO', label: 'Intermedio' },
  { value: 'AVANZADO', label: 'Avanzado' },
] as const;

export const COLORES_CURSO = [
  '#6366F1',
  '#8B5CF6',
  '#EC4899',
  '#F59E0B',
  '#10B981',
  '#3B82F6',
  '#EF4444',
] as const;
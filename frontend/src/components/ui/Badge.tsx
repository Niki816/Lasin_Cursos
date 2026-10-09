import { cn } from '@/lib/utils/cn';
import type { EstadoPreinscripcion } from '@/types/preinscripcion.types';

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'pendiente'
    | 'aceptado'
    | 'rechazado'
    | 'default'
    | 'primary'
    | 'info';
  className?: string;
  size?: 'sm' | 'md';
}

const variants = {
  pendiente:
    'bg-amber-500/15 text-amber-400 border-amber-500/40 shadow-[0_1px_2px_rgba(245,158,11,0.1)]',
  aceptado:
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 shadow-[0_1px_2px_rgba(16,185,129,0.1)]',
  rechazado:
    'bg-red-500/15 text-red-400 border-red-500/40 shadow-[0_1px_2px_rgba(239,68,68,0.1)]',
  default: 'bg-bg-tertiary text-text-secondary border-border',
  primary: 'bg-brand-primary/15 text-brand-primary border-brand-primary/40',
  info: 'bg-blue-500/15 text-blue-400 border-blue-500/40',
};

const sizes = {
  sm: 'px-3 py-1 text-[10px]',
  md: 'px-3.5 py-1.5 text-xs',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-bold uppercase tracking-wide',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}

/**
 * Badge específico para estados de preinscripción
 */
export function EstadoBadge({ estado }: { estado: EstadoPreinscripcion }) {
  const labels: Record<EstadoPreinscripcion, string> = {
    pendiente: '⏳ Pendiente',
    aceptado: '✅ Aceptado',
    rechazado: '❌ Rechazado',
  };

  return <Badge variant={estado}>{labels[estado]}</Badge>;
}
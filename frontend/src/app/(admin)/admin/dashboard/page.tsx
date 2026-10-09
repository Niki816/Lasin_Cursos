'use client';

import Link from 'next/link';
import { BookOpen, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCursos } from '@/hooks/useCursos';
import { usePreinscripciones } from '@/hooks/usePreinscripciones';

export default function DashboardPage() {
  const { cursos, loading: loadingCursos } = useCursos();
  const { preinscripciones, loading: loadingPre } = usePreinscripciones();

  const pendientes = preinscripciones.filter(
    (p) => p.estado === 'pendiente'
  ).length;
  const aceptados = preinscripciones.filter(
    (p) => p.estado === 'aceptado'
  ).length;
  const rechazados = preinscripciones.filter(
    (p) => p.estado === 'rechazado'
  ).length;

  const stats = [
    {
      label: 'Cursos',
      value: cursos.length,
      icon: BookOpen,
      color: 'from-brand-primary to-brand-secondary',
      href: '/admin/cursos',
    },
    {
      label: 'Preinscripciones',
      value: preinscripciones.length,
      icon: Users,
      color: 'from-brand-secondary to-brand-accent',
      href: '/admin/preinscripciones',
    },
    {
      label: 'Pendientes',
      value: pendientes,
      icon: Clock,
      color: 'from-amber-500 to-orange-500',
      href: '/admin/preinscripciones',
    },
    {
      label: 'Aceptados',
      value: aceptados,
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500',
      href: '/admin/preinscripciones',
    },
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-3xl font-black mb-1">Dashboard</h1>
        <p className="text-text-secondary">
          Resumen general del sistema de cursos.
        </p>
      </div>

      {(loadingCursos || loadingPre) && (
        <Spinner size="md" label="Cargando métricas..." />
      )}

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <Card hover className="cursor-pointer">
              <CardBody>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg`}
                >
                  <s.icon size={22} className="text-white" />
                </div>
                <p className="text-3xl font-black text-text-primary mb-1">
                  {s.value}
                </p>
                <p className="text-xs uppercase font-bold tracking-wider text-text-muted">
                  {s.label}
                </p>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Cursos recientes</h2>
              <Link href="/admin/cursos">
                <Button variant="ghost" size="sm" icon={<ArrowRight size={14} />} iconPosition="right">
                  Ver todos
                </Button>
              </Link>
            </div>
            {cursos.length === 0 ? (
              <p className="text-sm text-text-muted py-6 text-center">
                No hay cursos creados.
              </p>
            ) : (
              <ul className="space-y-3">
                {cursos.slice(0, 5).map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <span className="text-sm font-semibold text-text-primary truncate">
                      {c.nombre}
                    </span>
                    <span className="text-xs font-bold text-brand-primary">
                      Bs. {Number(c.costo).toFixed(2)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <h2 className="text-lg font-bold mb-6">Estado de preinscripciones</h2>
            <div className="space-y-4">
              {[
                { label: 'Pendientes', value: pendientes, color: 'bg-amber-500' },
                { label: 'Aceptados', value: aceptados, color: 'bg-emerald-500' },
                { label: 'Rechazados', value: rechazados, color: 'bg-red-500' },
              ].map((item) => {
                const total = preinscripciones.length || 1;
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary font-semibold">
                        {item.label}
                      </span>
                      <span className="font-bold text-text-primary">
                        {item.value} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 bg-bg-primary rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
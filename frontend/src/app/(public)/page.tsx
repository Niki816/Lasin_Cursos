import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CursoGrid } from '@/components/cursos/CursoGrid';
import { cursosApi } from '@/lib/api/cursos.api';

export const revalidate = 60; // ISR cada 60 segundos

export default async function HomePage() {
  let cursos: Awaited<ReturnType<typeof cursosApi.listar>> = [];
  try {
    cursos = await cursosApi.listar({ publicado: true });
  } catch {
    cursos = [];
  }
  const cursosDestacados = cursos.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:45px_45px]" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-brand-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full bg-brand-accent/15 blur-3xl" />

        <div className="container-custom relative">
          <div className="max-w-3xl mx-auto text-center animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                Inscripciones Abiertas
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="block text-text-primary">Transforma tu</span>
              <span className="block gradient-text">Futuro Profesional</span>
            </h1>

            <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
              Cursos de alta calidad en el Laboratorio Superior de Informática
              de la UMSA. Certificación oficial, instructores expertos y
              formación 100% práctica.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/cursos">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Ver Cursos
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Iniciar Sesión
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: `${cursos.length}+`, label: 'Cursos', icon: BookOpen },
                { value: '100%', label: 'Prácticos', icon: Award },
                { value: '2500+', label: 'Egresados', icon: Users },
                { value: '25+', label: 'Años', icon: Sparkles },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="glass rounded-2xl p-5 text-center hover:scale-105 transition-transform"
                >
                  <stat.icon
                    size={22}
                    className="mx-auto mb-2 text-brand-primary"
                  />
                  <p className="text-2xl font-black gradient-text">
                    {stat.value}
                  </p>
                  <p className="text-xs uppercase font-bold tracking-wider text-text-muted mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CURSOS DESTACADOS */}
      <section className="py-20 bg-bg-secondary/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-primary mb-3">
              Nuestro Catálogo
            </p>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Cursos <span className="gradient-text">Destacados</span>
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Formaciones diseñadas por expertos para el mercado actual.
            </p>
          </div>

          <CursoGrid cursos={cursosDestacados} />

          {cursos.length > 6 && (
            <div className="text-center mt-12">
              <Link href="/cursos">
                <Button variant="outline" size="lg" icon={<ArrowRight size={18} />}>
                  Ver todos los cursos
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20">
        <div className="container-custom">
          <div className="relative overflow-hidden rounded-3xl gradient-brand p-12 md:p-16 text-center">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
                ¿Listo para comenzar?
              </h2>
              <p className="text-white/80 max-w-2xl mx-auto mb-8">
                Únete a cientos de profesionales que ya están transformando su
                carrera con LASIN.
              </p>
              <Link href="/cursos">
                <Button
                  variant="secondary"
                  size="lg"
                  className="!bg-white !text-brand-primary hover:!bg-white/90"
                  icon={<ArrowRight size={18} />}
                  iconPosition="right"
                >
                  Explorar Cursos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
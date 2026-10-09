'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { cursoSchema, type CursoFormInput } from '@/lib/schemas/curso.schema';
import { MODALIDADES, NIVELES, COLORES_CURSO } from '@/lib/utils/constants';
import type { Curso, CursoFormData } from '@/types/curso.types';

interface CursoFormProps {
  initialData?: Curso;
  onSubmit: (data: CursoFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}

export function CursoForm({
  initialData,
  onSubmit,
  onCancel,
  loading,
}: CursoFormProps) {
  const [aficheFile, setAficheFile] = useState<File | null>(null);
  const [afichePreview, setAfichePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CursoFormInput>({
    resolver: zodResolver(cursoSchema) as never,
    defaultValues: initialData
      ? {
          nombre: initialData.nombre,
          nivel: initialData.nivel ?? '',
          modalidad: initialData.modalidad ?? '',
          fechaInicio: initialData.fechaInicio?.split('T')[0] ?? '',
          fechaFin: initialData.fechaFin?.split('T')[0] ?? '',
          horaInicio: initialData.horaInicio ?? '',
          horaFin: initialData.horaFin ?? '',
          duracion: initialData.duracion ?? '',
          costo: Number(initialData.costo),
          color: initialData.color ?? '#6366F1',
          descripcion: initialData.descripcion ?? '',
          totalHoras: initialData.totalHoras ?? 0,
          instructor: initialData.instructor ?? '',
          contenido: initialData.contenido ?? '',
          requisitosPrevios: initialData.requisitosPrevios ?? '',
          enlaceWhatsapp: initialData.enlaceWhatsapp ?? '',
        }
      : {
          color: '#6366F1',
          costo: 0,
          totalHoras: 0,
        },
  });

  useEffect(() => {
    if (initialData?.aficheUrl) {
      setAfichePreview(initialData.aficheUrl);
    }
  }, [initialData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAficheFile(file);
    setAfichePreview(URL.createObjectURL(file));
  };

  const handleFormSubmit = async (data: CursoFormInput) => {
    const payload: CursoFormData = {
      ...data,
      costo: Number(data.costo),
      totalHoras: data.totalHoras ? Number(data.totalHoras) : undefined,
      afiche: aficheFile,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Datos básicos */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold">Información básica</h3>
        </CardHeader>
        <CardBody className="space-y-5">
          <Input
            label="Nombre del curso"
            placeholder="Ej: Desarrollo Web Full Stack"
            required
            {...register('nombre')}
            error={errors.nombre?.message}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Select
              label="Nivel"
              placeholder="Selecciona nivel"
              options={[...NIVELES]}
              {...register('nivel')}
              error={errors.nivel?.message}
            />
            <Select
              label="Modalidad"
              placeholder="Selecciona modalidad"
              options={[...MODALIDADES]}
              {...register('modalidad')}
              error={errors.modalidad?.message}
            />
          </div>

          <Textarea
            label="Descripción"
            placeholder="Describe brevemente el curso..."
            rows={4}
            {...register('descripcion')}
            error={errors.descripcion?.message}
          />
        </CardBody>
      </Card>

      {/* Fechas y horarios */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold">Fechas y horarios</h3>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              type="date"
              label="Fecha de inicio"
              {...register('fechaInicio')}
              error={errors.fechaInicio?.message}
            />
            <Input
              type="date"
              label="Fecha de finalización"
              {...register('fechaFin')}
              error={errors.fechaFin?.message}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              type="time"
              label="Hora de inicio"
              {...register('horaInicio')}
              error={errors.horaInicio?.message}
            />
            <Input
              type="time"
              label="Hora de finalización"
              {...register('horaFin')}
              error={errors.horaFin?.message}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Duración (ej: 4 semanas)"
              placeholder="4 semanas"
              {...register('duracion')}
              error={errors.duracion?.message}
            />
            <Input
              type="number"
              label="Total de horas"
              placeholder="40"
              {...register('totalHoras')}
              error={errors.totalHoras?.message}
            />
          </div>
        </CardBody>
      </Card>

      {/* Detalles académicos */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold">Detalles académicos</h3>
        </CardHeader>
        <CardBody className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Inversión (Bs.)"
              type="number"
              step="0.01"
              placeholder="500.00"
              {...register('costo')}
              error={errors.costo?.message}
            />
            <Input
              label="Instructor"
              placeholder="Nombre del instructor"
              {...register('instructor')}
              error={errors.instructor?.message}
            />
          </div>

          <Textarea
            label="Contenido del curso"
            placeholder="Un tema por línea..."
            rows={6}
            {...register('contenido')}
            error={errors.contenido?.message}
          />

          <Textarea
            label="Requisitos previos"
            placeholder="Un requisito por línea..."
            rows={4}
            {...register('requisitosPrevios')}
            error={errors.requisitosPrevios?.message}
          />

          <Input
            label="Enlace de WhatsApp"
            placeholder="https://chat.whatsapp.com/..."
            {...register('enlaceWhatsapp')}
            error={errors.enlaceWhatsapp?.message}
          />
        </CardBody>
      </Card>

      {/* Afiche y color */}
      <Card>
        <CardHeader>
          <h3 className="text-base font-bold">Presentación visual</h3>
        </CardHeader>
        <CardBody className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              Afiche del curso
            </label>
            <div className="flex items-center gap-4">
              {afichePreview ? (
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-border flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={afichePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl border-2 border-dashed border-border flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={24} className="text-text-muted" />
                </div>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="block w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:uppercase file:bg-brand-primary file:text-white hover:file:bg-brand-secondary file:cursor-pointer cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              Color del curso
            </label>
            <div className="flex flex-wrap gap-2">
              {COLORES_CURSO.map((color) => (
                <label key={color} className="cursor-pointer">
                  <input
                    type="radio"
                    value={color}
                    {...register('color')}
                    className="peer sr-only"
                  />
                  <span
                    className="block w-10 h-10 rounded-xl border-2 border-transparent peer-checked:border-white peer-checked:scale-110 transition-all shadow-lg"
                    style={{ backgroundColor: color }}
                  />
                </label>
              ))}
            </div>
            {errors.color && (
              <p className="mt-1.5 text-xs text-red-400 font-medium">
                {errors.color.message}
              </p>
            )}
          </div>
        </CardBody>
        <CardFooter className="flex justify-end gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          )}
          <Button type="submit" variant="primary" loading={loading}>
            {initialData ? 'Actualizar Curso' : 'Crear Curso'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
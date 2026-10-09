'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Upload, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import {
  preinscripcionSchema,
  type PreinscripcionFormInput,
} from '@/lib/schemas/preinscripcion.schema';
import { preinscripcionesApi } from '@/lib/api/preinscripciones.api';
import { toast } from 'sonner';

interface PreinscripcionFormProps {
  cursoId: number;
  cursoNombre: string;
  onSuccess?: () => void;
}

export function PreinscripcionForm({
  cursoId,
  cursoNombre,
  onSuccess,
}: PreinscripcionFormProps) {
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PreinscripcionFormInput>({
    resolver: zodResolver(preinscripcionSchema) as never,
    defaultValues: { cursoId },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo no puede superar los 5MB');
      return;
    }

    setComprobante(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data: PreinscripcionFormInput) => {
    try {
      setSubmitting(true);
      const response = await preinscripcionesApi.crear({
        ...data,
        comprobante,
      });

      if (response.status === 'duplicado') {
        toast.warning(response.message || 'Ya estás preinscrito');
        return;
      }

      setSuccess(true);
      toast.success('¡Preinscripción enviada correctamente!');
      reset();
      setComprobante(null);
      setPreview(null);
      onSuccess?.();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <Card>
        <CardBody className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <CheckCircle2 size={32} className="text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-text-primary mb-2">
            ¡Preinscripción exitosa!
          </h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Recibirás un correo con los detalles. Espera a que el administrador
            verifique tu pago.
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-base font-bold">Formulario de Preinscripción</h3>
        <p className="text-sm text-text-secondary mt-1">{cursoNombre}</p>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardBody className="space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="tu@correo.com"
            required
            {...register('correo')}
            error={errors.correo?.message}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Nombres"
              placeholder="Juan Carlos"
              required
              {...register('nombres')}
              error={errors.nombres?.message}
            />
            <Input
              label="Apellido Paterno"
              placeholder="Pérez"
              required
              {...register('apellidoPaterno')}
              error={errors.apellidoPaterno?.message}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Apellido Materno"
              placeholder="Gómez"
              {...register('apellidoMaterno')}
              error={errors.apellidoMaterno?.message}
            />
            <Input
              label="Cédula de Identidad"
              placeholder="1234567 LP"
              {...register('ci')}
              error={errors.ci?.message}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <Input
              label="Teléfono"
              placeholder="+591 77712345"
              {...register('telefono')}
              error={errors.telefono?.message}
            />
            <Input
              label="Institución de Estudios"
              placeholder="UMSA"
              {...register('institucionEstudios')}
              error={errors.institucionEstudios?.message}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-secondary mb-2">
              Comprobante de pago
              <span className="text-red-400 ml-1">*</span>
            </label>
            <div className="flex items-center gap-4">
              <label
                htmlFor="comprobante"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-border cursor-pointer transition-colors hover:border-brand-primary hover:bg-brand-primary/5"
              >
                <Upload size={18} className="text-brand-primary" />
                <span className="text-sm font-semibold text-text-secondary">
                  {comprobante ? comprobante.name : 'Seleccionar archivo'}
                </span>
              </label>
              <input
                id="comprobante"
                type="file"
                accept="image/jpeg,image/png,application/pdf"
                className="sr-only"
                onChange={handleFileChange}
              />
            </div>
            {preview && comprobante?.type.startsWith('image/') && (
              <div className="mt-3 w-32 h-32 rounded-lg overflow-hidden border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <p className="mt-1.5 text-xs text-text-muted">
              Formatos: JPG, PNG o PDF. Máximo 5MB.
            </p>
          </div>

          <Textarea
            label="Observaciones (opcional)"
            placeholder="Algo que debamos saber..."
            rows={3}
            {...register('observaciones')}
            error={errors.observaciones?.message}
          />
        </CardBody>

        <CardFooter>
          <Button
            type="submit"
            variant="primary"
            loading={submitting}
            className="w-full"
          >
            Enviar Preinscripción
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
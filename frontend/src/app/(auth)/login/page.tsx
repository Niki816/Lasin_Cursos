'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, Mail, Lock } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  loginSchema,
  type LoginFormInput,
} from '@/lib/schemas/auth.schema';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInput>({
    resolver: zodResolver(loginSchema),
  });

  // Redirigir si ya está logueado
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/admin/dashboard');
    }
  }, [isAuthenticated, authLoading, router]);

  const onSubmit = async (data: LoginFormInput) => {
    try {
      setSubmitting(true);
      await login(data.email, data.password);
      toast.success('¡Bienvenido!');
      router.push('/admin/dashboard');
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error desconocido';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardBody className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-brand mb-4 shadow-lg shadow-brand-primary/30">
            <LogIn size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-black text-text-primary mb-1">
            Panel Administrativo
          </h1>
          <p className="text-sm text-text-secondary">
            Accede con tus credenciales
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Correo electrónico"
            type="email"
            placeholder="admin@lasin.com"
            icon={<Mail size={18} />}
            {...register('email')}
            error={errors.email?.message}
            autoComplete="email"
          />

          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            icon={<Lock size={18} />}
            {...register('password')}
            error={errors.password?.message}
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            size="lg"
            loading={submitting}
          >
            Iniciar Sesión
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
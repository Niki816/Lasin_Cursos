'use client';

import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { useRequireAuth } from '@/hooks/useAuth';
import { FullPageSpinner } from '@/components/ui/Spinner';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoading } = useRequireAuth();

  // Mientras carga Zustand O no está autenticado, no renderizar children
  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <FullPageSpinner label="Verificando sesión..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
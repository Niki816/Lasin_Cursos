'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth.store';
import { authApi } from '@/lib/api/auth.api';
import { toast } from 'sonner';

export function useAuth() {
  const router = useRouter();
  const { usuario, token, isAuthenticated, login, logout, _hasHydrated } =
    useAuthStore();

  const loginWithApi = async (email: string, password: string) => {
    const response = await authApi.login({ email, password });
    login(response.token, response.usuario);
    return response;
  };

  const logoutWithRedirect = (redirectTo: string = '/') => {
    logout();
    router.push(redirectTo);
  };

  return {
    usuario,
    token,
    isAuthenticated,
    isLoading: !_hasHydrated,
    login: loginWithApi,
    logout: logoutWithRedirect,
  };
}

export function useRequireAuth() {
  const router = useRouter();
  const { isAuthenticated, _hasHydrated } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para acceder');
      router.replace('/login');
    }
  }, [isAuthenticated, _hasHydrated, router]);

  return { isAuthenticated, isLoading: !_hasHydrated };
}
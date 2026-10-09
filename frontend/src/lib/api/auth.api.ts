import apiClient from './axios';
import type { LoginPayload, LoginResponse, Usuario } from '@/types/auth.types';

export const authApi = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>(
      '/auth/login',
      payload
    );
    return data;
  },

  async me(): Promise<{ status: 'ok'; usuario: Usuario }> {
    const { data } = await apiClient.get('/auth/me');
    return data;
  },
};
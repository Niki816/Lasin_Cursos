export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'user';
}

export interface LoginResponse {
  status: 'ok';
  token: string;
  usuario: Usuario;
}

export interface LoginPayload {
  email: string;
  password: string;
}
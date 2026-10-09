export interface ApiResponse<T = unknown> {
  status: 'ok' | 'error' | 'duplicado';
  message?: string;
  data?: T;
}
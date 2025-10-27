import { api } from './fetcher';
import { LoginRequest, AuthResponse, User } from '@/types/auth';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    return await api.post<AuthResponse>('/api/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

};
// types/auth.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
  message?: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
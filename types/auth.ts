// types/auth.ts

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  roles: string[]; // Backend devuelve Set<String> roles
  message?: string;
}

export interface User {
  id: string;
  username: string;
  roles: string[]; // Array de roles del usuario
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
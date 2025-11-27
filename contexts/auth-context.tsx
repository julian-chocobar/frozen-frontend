'use client';

import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { AuthState, User, LoginRequest } from '@/types/auth';
import { authApi } from '@/lib/fetcher';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: User }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'AUTH_LOGOUT':
      return {
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Verificar sesión al inicio
  error: null,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Verificar sesión existente al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const isValid = await authApi.validateSession();
      if (isValid) {
        const currentUser = await authApi.getCurrentUser();
        console.log('🔐 User authenticated:', currentUser);
        console.log('🔐 User roles:', currentUser.roles);
        
        // Crear objeto User con ID como string
        const user: User = {
          id: currentUser.id.toString(),
          username: currentUser.username,
          roles: currentUser.roles,
        };
        
        dispatch({ type: 'AUTH_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'AUTH_FAILURE', payload: 'Autentícate para ingresar' });
      }
    } catch (error) {
      console.error('🔐 Session check error:', error);
      dispatch({ type: 'AUTH_FAILURE', payload: 'Error verificando autenticación' });
    }
  };

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await authApi.login(credentials);
      
      // Obtener el usuario completo con ID desde /api/auth/me
      const currentUser = await authApi.getCurrentUser();
      
      // Crear usuario desde la respuesta completa
      const user: User = {
        id: currentUser.id.toString(), // Convertir a string para consistencia
        username: currentUser.username || response.username,
        roles: currentUser.roles || response.roles || [],
      };
      
      dispatch({ type: 'AUTH_SUCCESS', payload: user });
    } catch (error: any) {
      // Normalizar mensajes de error de autenticación
      let message = error.message || 'Error en el login';
      
      // Cambiar mensajes comunes de "No autenticado" a un mensaje más amigable
      if (message.toLowerCase().includes('no autenticado') || 
          message.toLowerCase().includes('unauthorized') ||
          message === 'No autenticado') {
        message = 'Autentícate para ingresar';
      }
      
      dispatch({ type: 'AUTH_FAILURE', payload: message });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Error durante logout:', error);
    } finally {
      dispatch({ type: 'AUTH_LOGOUT' });
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
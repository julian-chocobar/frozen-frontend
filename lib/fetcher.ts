// lib/fetcher.ts

export interface FetcherOptions extends RequestInit {
  params?: Record<string, string>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Cliente HTTP para Spring Security con proxy Next.js
 * - Usa rutas relativas /api/* que se redirigen al backend via proxy
 * - Maneja cookies JSESSIONID automáticamente
 * - Funciona tanto en cliente como servidor
 */
export async function fetcher<T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Determinar URL base según el contexto
  let url: string;
  
  if (typeof window === 'undefined') {
    // Server-side: usar backend directo con URL absoluta
    const backendUrl = 'http://localhost:8080';
    url = `${backendUrl}${endpoint}`;
  } else {
    // Client-side: usar proxy de Next.js (rutas relativas)
    url = endpoint;
  }
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString());
      }
    });
    url += `?${searchParams.toString()}`;
  }

  console.log('🌐 Fetching:', url, typeof window === 'undefined' ? '(SSR)' : '(Client)'); // Debug

  let response: Response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      credentials: 'include', // 🔐 CRÍTICO: Incluir cookies JSESSIONID
    });
  } catch (error) {
    console.error('🚨 Fetch failed:', error);
    throw new ApiError(
      `Error de conexión: ${error instanceof Error ? error.message : 'Unknown error'}`,
      0,
      'NETWORK_ERROR'
    );
  }

  // Manejar respuesta vacía
  if (response.status === 204) {
    return null as T;
  }

  // Parsear JSON
  let data;
  try {
    data = await response.json();
  } catch (error) {
    if (!response.ok) {
      throw new ApiError(
        response.statusText,
        response.status,
        response.statusText
      );
    }
    return null as T;
  }

  // Manejar errores HTTP
  if (!response.ok) {
    // Redirigir a login en caso de 401
    if (response.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    
    throw new ApiError(
      data?.message || data?.error || response.statusText,
      response.status,
      response.statusText,
      data
    );
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    fetcher<T>(endpoint, { 
      method: 'GET', 
      params 
    }),

  post: <T>(endpoint: string, data?: unknown) =>
    fetcher<T>(endpoint, { 
      method: 'POST', 
      body: JSON.stringify(data) 
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    fetcher<T>(endpoint, { 
      method: 'PATCH', 
      body: JSON.stringify(data) 
    }),

  delete: <T>(endpoint: string) =>
    fetcher<T>(endpoint, { 
      method: 'DELETE' 
    }),
};export const authApi = {
  login: async (credentials: { username: string; password: string }) => {
    return api.post<{
      token: string;
      username: string;
      role: string;
      message?: string;
    }>('/api/auth/login', credentials);
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  validateSession: async (): Promise<boolean> => {
    try {
      await api.get('/api/auth/validate');
      return true;
    } catch {
      return false;
    }
  },

  getCurrentUser: async () => {
    return api.get<{
      id: string;
      username: string;
      role: string;
      email?: string;
    }>('/api/auth/me');
  },
};


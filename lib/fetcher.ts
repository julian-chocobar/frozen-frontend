/**
 * Utilidad para realizar peticiones HTTP al backend
 * Maneja autenticación básica de Spring Security
 */

import { ApiError, type BackendErrorResponse } from './api-error'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

// Credenciales por defecto de Spring Security
// Estas son las credenciales que vienen por defecto con Spring Boot Security
const DEFAULT_USERNAME = 'user'
const DEFAULT_PASSWORD = '1234'

interface FetcherOptions extends RequestInit {
  params?: Record<string, string>
  auth?: {
    username?: string
    password?: string
  }
}

/**
 * Función principal para hacer peticiones al backend
 * Incluye autenticación básica de Spring Security
 */
export async function fetcher<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
  const { params, auth, ...fetchOptions } = options

  // Construir URL con parámetros de query si existen
  let url = `${BACKEND_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  // Usar credenciales proporcionadas o las por defecto
  const username = auth?.username || DEFAULT_USERNAME
  const password = auth?.password || DEFAULT_PASSWORD
  const basicAuth = btoa(`${username}:${password}`)

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    })

    // Manejar respuestas de error
    if (!response.ok) {
      // Intentar parsear la respuesta de error del backend
      let errorData: Partial<BackendErrorResponse> = {}
      try {
        errorData = await response.json()
      } catch {
        // Si no se puede parsear, usar un mensaje genérico
        errorData = {}
      }

      // Extraer el mensaje de error del backend o usar uno por defecto
      const errorMessage = errorData.message || response.statusText || `Error ${response.status}`

      // Caso especial: Error 401 - Redirigir a login
      if (response.status === 401) {
        if (typeof window !== "undefined") {
          window.location.href = "/login"
        }
      }

      // Crear y lanzar ApiError con toda la información del backend
      throw new ApiError(
        errorMessage,
        response.status,
        response.statusText,
        errorData
      )
    }

    // Si la respuesta es 204 No Content, retornar null
    if (response.status === 204) {
      return null as T
    }

    return await response.json()
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error)
    
    // Si ya es un ApiError, re-lanzarlo sin modificar
    if (ApiError.isApiError(error)) {
      throw error
    }
    
    // Manejar errores de conexión específicamente
    if (error instanceof TypeError && 
        (error.message.includes('fetch failed') || 
         error.message.includes('Failed to fetch'))) {
      throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté en ejecución.')
    }
    
    throw error
  }
}

/**
 * Métodos de conveniencia para diferentes tipos de peticiones
 */
export const api = {
  get: <T>(endpoint: string, params?: Record<string, string>, auth?: { username?: string; password?: string }) =>
    fetcher<T>(endpoint, { method: 'GET', params, auth }),

  post: <T>(endpoint: string, data?: unknown, auth?: { username?: string; password?: string }) =>
    fetcher<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      auth,
    }),

  put: <T>(endpoint: string, data?: unknown, auth?: { username?: string; password?: string }) =>
    fetcher<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      auth,
    }),

  patch: <T>(endpoint: string, data?: unknown, auth?: { username?: string; password?: string }) =>
    fetcher<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      auth,
    }),

  delete: <T>(endpoint: string, auth?: { username?: string; password?: string }) =>
    fetcher<T>(endpoint, { method: 'DELETE', auth }),
}

/**
 * Función helper para crear un cliente API con credenciales personalizadas
 * Útil cuando necesites usar diferentes credenciales en el futuro
 */
export function createApiClient(username: string, password: string) {
  return {
    get: <T>(endpoint: string, params?: Record<string, string>) =>
      api.get<T>(endpoint, params, { username, password }),

    post: <T>(endpoint: string, data?: unknown) =>
      api.post<T>(endpoint, data, { username, password }),

    put: <T>(endpoint: string, data?: unknown) =>
      api.put<T>(endpoint, data, { username, password }),

    patch: <T>(endpoint: string, data?: unknown) =>
      api.patch<T>(endpoint, data, { username, password }),

    delete: <T>(endpoint: string) =>
      api.delete<T>(endpoint, { username, password }),
  }
}

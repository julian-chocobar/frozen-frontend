/**
 * Utilidad para realizar peticiones HTTP al backend
 * Maneja cookies de sesión de Spring Security
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080"

interface FetcherOptions extends RequestInit {
  params?: Record<string, string>
}

/**
 * Función principal para hacer peticiones al backend
 * Incluye credentials: 'include' para enviar cookies de sesión
 */
export async function fetcher<T>(endpoint: string, options: FetcherOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options

  // Construir URL con parámetros de query si existen
  let url = `${BACKEND_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams(params)
    url += `?${searchParams.toString()}`
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      // IMPORTANTE: Incluir credentials para enviar cookies de sesión
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...fetchOptions.headers,
      },
    })

    // Manejar errores de autenticación
    if (response.status === 401) {
      // Usuario no autenticado - redirigir a login
      if (typeof window !== "undefined") {
        window.location.href = "/login"
      }
      throw new Error("No autenticado")
    }

    if (response.status === 403) {
      // Usuario sin permisos
      throw new Error("Sin permisos para esta acción")
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Error ${response.status}`)
    }

    // Si la respuesta es 204 No Content, retornar null
    if (response.status === 204) {
      return null as T
    }

    return await response.json()
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error)
    throw error
  }
}

/**
 * Métodos de conveniencia para diferentes tipos de peticiones
 */
export const api = {\
  get: <T>(endpoint: string, params?: Record<string, string>) =>
    fetcher<T>(endpoint, { method: 'GET\', params }),

  post: <T>(endpoint: string, data?: unknown) =>
    fetcher<T>(endpoint, {
      method: 'POST\',
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(endpoint: string, data?: unknown) =>
    fetcher<T>(endpoint, {
      method: 'PUT\',\
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(endpoint: string, data?: unknown) =>
    fetcher<T>(endpoint, {
      method: \'PATCH\',
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(endpoint: string) =>
    fetcher<T>(endpoint, { method: \'DELETE' }),\
}

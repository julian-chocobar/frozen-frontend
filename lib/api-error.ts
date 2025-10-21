/**
 * Tipos y clases para manejar errores del backend de manera estructurada
 * Corresponde con el GlobalExceptionHandler de Spring Boot
 */

/**
 * Estructura de respuesta de error del backend
 * Coincide con la estructura del GlobalExceptionHandler
 */
export interface BackendErrorResponse {
  timestamp: string
  status: number
  error: string
  message: string
  details?: Record<string, string> // Para errores de validación
}

/**
 * Clase personalizada para errores de la API
 * Extiende Error nativo y añade información específica del backend
 */
export class ApiError extends Error {
  public readonly status: number
  public readonly statusText: string
  public readonly timestamp?: string
  public readonly details?: Record<string, string>
  public readonly isApiError = true

  constructor(
    message: string,
    status: number,
    statusText: string = '',
    errorResponse?: Partial<BackendErrorResponse>
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.statusText = statusText
    this.timestamp = errorResponse?.timestamp
    this.details = errorResponse?.details

    // Mantiene el stack trace correcto en V8
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError)
    }
  }

  /**
   * Verifica si un error es una instancia de ApiError
   */
  static isApiError(error: unknown): error is ApiError {
    return error instanceof ApiError || (error as ApiError)?.isApiError === true
  }

  /**
   * Obtiene un mensaje de error amigable para el usuario
   */
  getUserMessage(): string {
    // Si hay detalles de validación, formatearlos
    if (this.details) {
      const detailMessages = Object.entries(this.details)
        .map(([field, msg]) => `${field}: ${msg}`)
        .join('\n')
      
      return `${this.message}\n\nDetalles:\n${detailMessages}`
    }

    return this.message
  }

  /**
   * Obtiene un título para el error basado en el status code
   */
  getTitle(): string {
    switch (this.status) {
      case 400:
        return 'Error de validación'
      case 401:
        return 'No autenticado'
      case 403:
        return 'Sin permisos'
      case 404:
        return 'No encontrado'
      case 409:
        return 'Conflicto de datos'
      case 500:
        return 'Error del servidor'
      default:
        return `Error ${this.status}`
    }
  }

  /**
   * Determina la variante del toast según el status code
   */
  getVariant(): 'default' | 'destructive' {
    return this.status >= 500 ? 'destructive' : 'default'
  }
}

/**
 * Verifica si un error es de conexión/red
 */
export function isNetworkError(error: unknown): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes('fetch failed') ||
      error.message.includes('Failed to fetch') ||
      error.message.includes('Network request failed'))
  )
}

/**
 * Obtiene un mensaje de error amigable de cualquier tipo de error
 */
export function getErrorMessage(error: unknown): string {
  if (ApiError.isApiError(error)) {
    return error.getUserMessage()
  }

  if (isNetworkError(error)) {
    return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Ocurrió un error inesperado'
}

/**
 * Obtiene el título del error
 */
export function getErrorTitle(error: unknown): string {
  if (ApiError.isApiError(error)) {
    return error.getTitle()
  }

  if (isNetworkError(error)) {
    return 'Error de conexión'
  }

  return 'Error'
}


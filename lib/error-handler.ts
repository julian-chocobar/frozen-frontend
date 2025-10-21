/**
 * Sistema global de manejo de errores
 * Integra los errores del backend con el sistema de toasts del frontend
 */

import { toast } from '@/hooks/use-toast'
import { ApiError, getErrorMessage, getErrorTitle } from './api-error'

/**
 * Opciones para el manejo de errores
 */
interface ErrorHandlerOptions {
  /**
   * Si es true, muestra un toast automáticamente
   * @default true
   */
  showToast?: boolean

  /**
   * Título personalizado para el toast
   */
  title?: string

  /**
   * Descripción personalizada para el toast
   */
  description?: string

  /**
   * Duración del toast en milisegundos
   * @default 5000
   */
  duration?: number

  /**
   * Callback que se ejecuta después de manejar el error
   */
  onError?: (error: unknown) => void

  /**
   * Si es true, también registra el error en la consola
   * @default true (en desarrollo)
   */
  logToConsole?: boolean
}

/**
 * Maneja un error de manera global
 * Muestra toasts, registra en consola, y ejecuta callbacks
 */
export function handleError(error: unknown, options: ErrorHandlerOptions = {}) {
  const {
    showToast = true,
    title,
    description,
    duration = 5000,
    onError,
    logToConsole = process.env.NODE_ENV === 'development',
  } = options

  // Log en consola si está habilitado
  if (logToConsole) {
    console.error('Error capturado por handleError:', error)
  }

  // Extraer información del error
  const errorTitle = title || getErrorTitle(error)
  const errorMessage = description || getErrorMessage(error)

  // Determinar la variante del toast
  let variant: 'default' | 'destructive' = 'destructive'
  if (ApiError.isApiError(error)) {
    variant = error.getVariant()
  }

  // Mostrar toast si está habilitado
  if (showToast) {
    toast({
      variant,
      title: errorTitle,
      description: errorMessage,
      duration,
    })
  }

  // Ejecutar callback si existe
  if (onError) {
    onError(error)
  }

  return {
    title: errorTitle,
    message: errorMessage,
    error,
  }
}

/**
 * Hook personalizado para manejar errores en componentes React
 * Uso:
 * 
 * ```tsx
 * const handleSubmit = async () => {
 *   try {
 *     await api.post('/materials', data)
 *     toast({ title: 'Material creado exitosamente' })
 *   } catch (error) {
 *     handleError(error)
 *   }
 * }
 * ```
 */
export { handleError as default }

/**
 * Wrapper para funciones asíncronas que maneja errores automáticamente
 * 
 * @example
 * ```tsx
 * const handleDelete = withErrorHandler(async () => {
 *   await api.delete(`/materials/${id}`)
 *   toast({ title: 'Material eliminado exitosamente' })
 * }, { title: 'Error al eliminar material' })
 * ```
 */
export function withErrorHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: ErrorHandlerOptions = {}
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args)
    } catch (error) {
      handleError(error, options)
      throw error // Re-lanza el error para que el caller pueda manejarlo si lo necesita
    }
  }) as T
}

/**
 * Maneja errores de validación de formularios
 * Útil para mostrar errores campo por campo
 */
export function handleValidationError(
  error: unknown,
  setFieldError?: (field: string, message: string) => void
) {
  if (ApiError.isApiError(error) && error.details) {
    // Si hay detalles de validación y una función para setear errores de campo
    if (setFieldError) {
      Object.entries(error.details).forEach(([field, message]) => {
        setFieldError(field, message)
      })
      return true
    }
  }

  // Si no se puede manejar como validación, manejar como error normal
  handleError(error)
  return false
}

/**
 * Muestra un mensaje de éxito usando el sistema de toast
 */
export function showSuccess(message: string, title: string = 'Éxito') {
  toast({
    variant: 'success' as any, // Success variant
    title,
    description: message,
    duration: 3000,
  })
}

/**
 * Muestra un mensaje de advertencia usando el sistema de toast
 */
export function showWarning(message: string, title: string = 'Advertencia') {
  toast({
    title,
    description: message,
    variant: 'default',
    duration: 4000,
  })
}

/**
 * Muestra un mensaje informativo usando el sistema de toast
 */
export function showInfo(message: string, title: string = 'Información') {
  toast({
    title,
    description: message,
    duration: 3000,
  })
}


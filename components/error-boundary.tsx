/**
 * Error Boundary para capturar errores de renderizado en React
 * 
 * Componente de clase que captura errores de JavaScript en cualquier parte del árbol de componentes,
 * los registra y muestra una UI de fallback en lugar del árbol que falló.
 * Previene que errores no manejados rompan toda la aplicación.
 * 
 * @example
 * ```tsx
 * // Uso básico
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * // Con callback personalizado
 * <ErrorBoundary
 *   onError={(error, errorInfo) => {
 *     // Enviar a servicio de monitoreo
 *     logErrorToService(error, errorInfo)
 *   }}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * 
 * // Con fallback personalizado
 * <ErrorBoundary
 *   fallback={<CustomErrorComponent />}
 * >
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

'use client'

import React from 'react'
import { ErrorState } from '@/components/ui/error-state'
import { handleError } from '@/lib/error-handler'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  /**
   * Función llamada cuando se captura un error
   */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  /**
   * Mensaje personalizado para mostrar al usuario
   */
  fallback?: React.ReactNode
  /**
   * Si es true, muestra detalles del error en desarrollo
   */
  showDetails?: boolean
}

/**
 * Error Boundary para capturar errores de renderizado
 * 
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log el error usando el sistema centralizado
    handleError(error, {
      title: 'Error de Renderizado',
      description: 'Ocurrió un error al renderizar el componente',
      showToast: false, // No mostrar toast, solo loggear
      logToConsole: true,
    })

    // Guardar información del error para debugging
    this.setState({
      errorInfo,
    })

    // Llamar callback personalizado si existe
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }

    // En producción, podrías enviar el error a un servicio de monitoreo
    if (process.env.NODE_ENV === 'production') {
      // Ejemplo: enviar a servicio de monitoreo
      // logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Mostrar fallback personalizado si existe
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Mostrar ErrorState por defecto
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-2xl w-full">
            <ErrorState
              error={this.state.error?.message || 'Ocurrió un error inesperado'}
              onRetry={this.handleReset}
            />
            
            {/* Mostrar detalles del error solo en desarrollo */}
            {this.props.showDetails && this.state.error && process.env.NODE_ENV === 'development' && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <details className="text-sm">
                  <summary className="cursor-pointer font-semibold text-red-800 mb-2">
                    Detalles del Error (Solo Desarrollo)
                  </summary>
                  <pre className="mt-2 p-3 bg-red-100 rounded overflow-auto text-xs font-mono">
                    {this.state.error.stack}
                    {this.state.errorInfo && (
                      <>
                        {'\n\n'}
                        <strong>Component Stack:</strong>
                        {'\n'}
                        {this.state.errorInfo.componentStack}
                      </>
                    )}
                  </pre>
                </details>
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook para usar Error Boundary de forma funcional (futuro)
 * Por ahora, usar el componente de clase
 */
export default ErrorBoundary


"use client"

/**
 * Componente para mostrar estados de error con opciones de recuperación
 * Reutilizable para diferentes páginas (materiales, movimientos, etc.)
 */

import { RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react"

interface ErrorStateProps {
  error: string
  onRetry?: () => void
  /** URL para recargar la página (por defecto usa la página actual) */
  reloadUrl?: string
}

export function ErrorState({ error, onRetry, reloadUrl }: ErrorStateProps) {
  const isConnectionError = error.includes('conectar con el servidor') || error.includes('ECONNREFUSED')
  
  return (
    <div className="p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        {isConnectionError ? (
          <WifiOff className="w-16 h-16 text-red-500" />
        ) : (
          <AlertCircle className="w-16 h-16 text-red-500" />
        )}
        
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            {isConnectionError ? 'Error de Conexión' : 'Error al Cargar Datos'}
          </h3>
          <p className="text-red-600 mb-4 max-w-md">
            {error}
          </p>
        </div>     

        <div className="flex gap-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </button>
          )}
          
          <a
            href={reloadUrl || window.location.pathname}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Wifi className="w-4 h-4" />
            Recargar Página
          </a>
        </div>
      </div>
    </div>
  )
}

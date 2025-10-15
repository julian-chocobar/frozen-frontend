"use client"

/**
 * Componente para mostrar estados de error con opciones de recuperación
 */

import { RefreshCw, AlertCircle, Wifi, WifiOff } from "lucide-react"

interface ErrorStateProps {
  error: string
  onRetry?: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const isConnectionError = error.includes('conectar con el backend') || error.includes('ECONNREFUSED')
  
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

        {isConnectionError && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 max-w-md">
            <h4 className="font-medium text-yellow-800 mb-2">Pasos para solucionar:</h4>
            <ul className="text-sm text-yellow-700 text-left space-y-1">
              <li>1. Verifica que tu backend Spring Boot esté ejecutándose</li>
              <li>2. Confirma que esté en el puerto 8080</li>
              <li>3. Revisa la consola del backend por errores</li>
              <li>4. Verifica la configuración de CORS</li>
            </ul>
          </div>
        )}

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
            href="/materiales"
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

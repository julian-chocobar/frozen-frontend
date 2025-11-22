/**
 * Componente MovementsErrorState - Estado de error compartido para movimientos
 * Muestra un mensaje de error con opción de reintentar
 * 
 * @example
 * ```tsx
 * if (error) {
 *   return <MovementsErrorState error={error} onRetry={reload} />
 * }
 * ```
 */

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MovementsErrorStateProps {
  /** Mensaje de error a mostrar */
  error: string
  /** Callback para reintentar la operación */
  onRetry?: () => void
  /** Variante del estilo */
  variant?: 'default' | 'compact'
}

export function MovementsErrorState({ 
  error, 
  onRetry,
  variant = 'default'
}: MovementsErrorStateProps) {
  const padding = variant === 'compact' ? 'py-8' : 'py-12'
  const iconSize = variant === 'compact' ? 'w-10 h-10' : 'w-12 h-12'

  return (
    <div className={`text-center ${padding}`}>
      <AlertCircle className={`${iconSize} text-red-400 mx-auto mb-3`} />
      <p className="text-sm text-red-600 font-medium mb-1">Error al cargar</p>
      <p className="text-xs text-red-500 mb-4">{error}</p>
      {onRetry && (
        <Button 
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          Reintentar
        </Button>
      )}
    </div>
  )
}

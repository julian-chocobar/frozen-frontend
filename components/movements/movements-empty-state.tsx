/**
 * Componente MovementsEmptyState - Estado vacío compartido para movimientos
 * Muestra un mensaje cuando no hay datos disponibles
 * 
 * @example
 * ```tsx
 * if (data.length === 0) {
 *   return <MovementsEmptyState message="No se encontraron movimientos" />
 * }
 * ```
 */

import { ArrowRightLeft } from 'lucide-react'

interface MovementsEmptyStateProps {
  /** Icono a mostrar (por defecto ArrowRightLeft) */
  icon?: React.ComponentType<{ className?: string }>
  /** Mensaje principal */
  message?: string
  /** Mensaje secundario opcional */
  description?: string
  /** Acción opcional (ej: botón para limpiar filtros) */
  action?: React.ReactNode
  /** Variante del estilo */
  variant?: 'default' | 'compact'
}

export function MovementsEmptyState({ 
  icon: Icon = ArrowRightLeft,
  message = 'No hay movimientos disponibles',
  description,
  action,
  variant = 'default'
}: MovementsEmptyStateProps) {
  const padding = variant === 'compact' ? 'py-8' : 'py-12'
  const iconSize = variant === 'compact' ? 'w-10 h-10' : 'w-12 h-12'

  return (
    <div className={`text-center ${padding}`}>
      <Icon className={`${iconSize} text-gray-300 mx-auto mb-3`} />
      <p className="text-sm text-primary-600 font-medium mb-1">{message}</p>
      {description && (
        <p className="text-xs text-primary-500 mb-3">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  )
}

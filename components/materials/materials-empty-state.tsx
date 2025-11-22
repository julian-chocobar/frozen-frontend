/**
 * Componente MaterialsEmptyState - Estado vacío compartido para materiales
 * Muestra un mensaje cuando no hay datos disponibles
 * 
 * @example
 * ```tsx
 * if (data.length === 0) {
 *   return <MaterialsEmptyState message="No se encontraron materiales" />
 * }
 * ```
 */

import { Package } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface MaterialsEmptyStateProps {
  /** Icono a mostrar (por defecto Package) */
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

export function MaterialsEmptyState({ 
  icon: Icon = Package,
  message = 'No hay materiales disponibles',
  description,
  action,
  variant = 'default'
}: MaterialsEmptyStateProps) {
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

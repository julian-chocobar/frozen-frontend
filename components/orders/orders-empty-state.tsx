/**
 * Estado vacío para órdenes de producción
 * Se muestra cuando no hay órdenes disponibles
 */

import { ClipboardList, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface OrdersEmptyStateProps {
  /**
   * Título del mensaje vacío
   */
  title?: string
  /**
   * Descripción del mensaje vacío
   */
  description?: string
  /**
   * Callback cuando se hace clic en el botón de acción
   */
  onAction?: () => void
  /**
   * Texto del botón de acción
   */
  actionLabel?: string
  /**
   * Icono personalizado (componente de Lucide)
   */
  icon?: React.ComponentType<{ className?: string }>
  /**
   * Si se debe mostrar el botón de acción
   */
  showAction?: boolean
}

/**
 * Componente de estado vacío para listado de órdenes
 * 
 * @example
 * ```tsx
 * {orders.length === 0 && (
 *   <OrdersEmptyState 
 *     onAction={() => setIsCreating(true)}
 *     actionLabel="Nueva Orden"
 *   />
 * )}
 * ```
 */
export function OrdersEmptyState({
  title = "No hay órdenes de producción",
  description = "Comienza creando tu primera orden de producción para planificar la fabricación de cerveza.",
  onAction,
  actionLabel = "Crear Primera Orden",
  icon: Icon = ClipboardList,
  showAction = true
}: OrdersEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-primary-50 p-6 mb-4">
        <Icon className="w-12 h-12 text-primary-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-primary-900 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-primary-600 max-w-md mb-6">
        {description}
      </p>
      
      {showAction && onAction && (
        <Button
          onClick={onAction}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </Button>
      )}
    </div>
  )
}

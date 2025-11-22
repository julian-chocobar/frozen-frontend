/**
 * Estado de carga para órdenes de producción
 * Muestra skeleton loaders mientras se cargan los datos
 */

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface OrdersLoadingStateProps {
  /**
   * Variante del estado de carga
   * - 'default': Muestra tarjetas skeleton completas
   * - 'compact': Versión más compacta para espacios reducidos
   */
  variant?: 'default' | 'compact'
  /**
   * Número de skeleton cards a mostrar
   */
  count?: number
}

/**
 * Componente de estado de carga para listado de órdenes
 * 
 * @example
 * ```tsx
 * {loading && <OrdersLoadingState count={6} />}
 * ```
 */
export function OrdersLoadingState({ 
  variant = 'default', 
  count = 6 
}: OrdersLoadingStateProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
          <p className="text-sm text-primary-600">Cargando órdenes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardContent className="p-6 space-y-4">
            {/* Header con estado */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>

            {/* Información principal */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4 rounded" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-2 pt-4">
              <Skeleton className="h-9 w-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

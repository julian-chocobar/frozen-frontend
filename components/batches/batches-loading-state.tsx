/**
 * Componente de estado de carga para la lista de lotes
 * Muestra skeletons animados mientras se cargan los datos
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface BatchesLoadingStateProps {
  /** Número de items skeleton a mostrar */
  count?: number
  /** Variante de visualización */
  variant?: 'default' | 'grid'
}

/**
 * Estado de carga para lotes
 * @example
 * <BatchesLoadingState count={12} variant="grid" />
 */
export function BatchesLoadingState({ 
  count = 12, 
  variant = 'grid' 
}: BatchesLoadingStateProps) {
  return (
    <div className={variant === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="space-y-3 pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Código de lote */}
                <Skeleton className="h-6 w-32" />
                {/* Nombre del producto */}
                <Skeleton className="h-5 w-48" />
              </div>
              {/* Badge de estado */}
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4 pt-0">
            {/* Cantidad */}
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
            
            {/* Fechas */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
            
            {/* Barra de progreso */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
            
            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              <Skeleton className="h-9 flex-1" />
              <Skeleton className="h-9 w-9" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

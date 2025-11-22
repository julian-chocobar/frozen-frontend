/**
 * Componente de estado de carga para la lista de productos
 * Muestra skeletons animados mientras se cargan los datos
 */

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface ProductsLoadingStateProps {
  /** Número de items skeleton a mostrar */
  count?: number
  /** Variante de visualización */
  variant?: 'default' | 'compact'
}

/**
 * Estado de carga para productos
 * @example
 * <ProductsLoadingState count={6} variant="compact" />
 */
export function ProductsLoadingState({ 
  count = 6, 
  variant = 'default' 
}: ProductsLoadingStateProps) {
  return (
    <div className={variant === 'compact' ? 'space-y-3' : 'grid gap-6 md:grid-cols-2 lg:grid-cols-3'}>
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2 flex-1">
                {/* Nombre del producto */}
                <Skeleton className="h-6 w-3/4" />
                {/* Estado alcohólico */}
                <Skeleton className="h-5 w-24" />
              </div>
              {/* Icono */}
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Cantidad estándar */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
            
            {/* Badges de estado */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            
            {variant === 'default' && (
              <>
                {/* Fecha de creación */}
                <div className="space-y-1">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-4 w-32" />
                </div>
                
                {/* Botones de acción */}
                <div className="flex gap-2 pt-2">
                  <Skeleton className="h-9 flex-1" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

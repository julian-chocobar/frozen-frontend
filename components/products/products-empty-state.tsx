/**
 * Componente de estado vacío para la lista de productos
 * Se muestra cuando no hay productos para mostrar
 */

import { PackageOpen, Plus, Filter } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProductsEmptyStateProps {
  /** Título personalizado */
  title?: string
  /** Descripción personalizada */
  description?: string
  /** Texto del botón de acción */
  actionLabel?: string
  /** Callback al hacer clic en el botón de acción */
  onAction?: () => void
  /** Si hay filtros activos */
  hasFilters?: boolean
  /** Callback para limpiar filtros */
  onClearFilters?: () => void
}

/**
 * Estado vacío para productos
 * @example
 * <ProductsEmptyState 
 *   title="No se encontraron productos"
 *   actionLabel="Crear Producto"
 *   onAction={() => router.push('/productos/nuevo')}
 *   hasFilters={true}
 *   onClearFilters={() => resetFilters()}
 * />
 */
export function ProductsEmptyState({
  title = 'No hay productos registrados',
  description = 'Comienza creando tu primer producto para gestionar tu catálogo',
  actionLabel = 'Crear Producto',
  onAction,
  hasFilters = false,
  onClearFilters
}: ProductsEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <PackageOpen className="h-12 w-12 text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold mb-2">
          {title}
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
        
        <div className="flex gap-3">
          {hasFilters && onClearFilters ? (
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          ) : null}
          
          {onAction && (
            <Button onClick={onAction} className="gap-2">
              <Plus className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

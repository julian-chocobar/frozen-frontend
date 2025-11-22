/**
 * Componente de estado vacío para la lista de lotes
 * Se muestra cuando no hay lotes para mostrar
 */

import { PackageX, Filter, Play } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface BatchesEmptyStateProps {
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
 * Estado vacío para lotes
 * @example
 * <BatchesEmptyState 
 *   title="No hay lotes en producción"
 *   hasFilters={true}
 *   onClearFilters={() => resetFilters()}
 *   onAction={() => handleProcessBatches()}
 * />
 */
export function BatchesEmptyState({
  title = 'No hay lotes registrados',
  description = 'Inicia la producción de lotes programados para hoy',
  actionLabel = 'Iniciar Producción',
  onAction,
  hasFilters = false,
  onClearFilters
}: BatchesEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <PackageX className="h-12 w-12 text-muted-foreground" />
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
              <Play className="h-4 w-4" />
              {actionLabel}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

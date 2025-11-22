/**
 * Estado de error para órdenes de producción
 * Se muestra cuando ocurre un error al cargar los datos
 */

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface OrdersErrorStateProps {
  /**
   * Mensaje de error a mostrar
   */
  error: string
  /**
   * Callback para reintentar la operación
   */
  onRetry?: () => void
  /**
   * Título del error
   */
  title?: string
  /**
   * Si se debe mostrar el botón de reintentar
   */
  showRetry?: boolean
}

/**
 * Componente de estado de error para listado de órdenes
 * 
 * @example
 * ```tsx
 * {error && (
 *   <OrdersErrorState 
 *     error={error}
 *     onRetry={() => loadOrders()}
 *   />
 * )}
 * ```
 */
export function OrdersErrorState({
  error,
  onRetry,
  title = "Error al cargar órdenes",
  showRetry = true
}: OrdersErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
        </AlertDescription>
        
        {showRetry && onRetry && (
          <div className="mt-4">
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reintentar
            </Button>
          </div>
        )}
      </Alert>
    </div>
  )
}

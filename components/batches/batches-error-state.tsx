/**
 * Componente de estado de error para la lista de lotes
 * Se muestra cuando ocurre un error al cargar los datos
 */

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface BatchesErrorStateProps {
  /** Título del error */
  title?: string
  /** Mensaje de error detallado */
  message?: string
  /** Callback para reintentar */
  onRetry?: () => void
  /** Si está reintentando */
  isRetrying?: boolean
}

/**
 * Estado de error para lotes
 * @example
 * <BatchesErrorState 
 *   message="No se pudieron cargar los lotes"
 *   onRetry={() => fetchBatches()}
 *   isRetrying={loading}
 * />
 */
export function BatchesErrorState({
  title = 'Error al cargar lotes',
  message = 'Ocurrió un error al intentar cargar los lotes. Por favor, intenta nuevamente.',
  onRetry,
  isRetrying = false
}: BatchesErrorStateProps) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription className="mt-2">
            {message}
          </AlertDescription>
          
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                disabled={isRetrying}
                className="gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
                {isRetrying ? 'Reintentando...' : 'Reintentar'}
              </Button>
            </div>
          )}
        </Alert>
      </CardContent>
    </Card>
  )
}

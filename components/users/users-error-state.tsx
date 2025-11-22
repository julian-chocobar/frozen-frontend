/**
 * Componente de estado de error para usuarios
 */

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface UsersErrorStateProps {
  message?: string
  onRetry?: () => void
  isRetrying?: boolean
}

export function UsersErrorState({
  message = 'Ocurrió un error al cargar los usuarios',
  onRetry,
  isRetrying = false
}: UsersErrorStateProps) {
  return (
    <Card className="border-destructive/50">
      <CardContent className="pt-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error al cargar usuarios</AlertTitle>
          <AlertDescription className="mt-2">{message}</AlertDescription>
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

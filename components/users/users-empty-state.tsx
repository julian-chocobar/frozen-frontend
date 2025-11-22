/**
 * Componente de estado vacío para usuarios
 */

import { UserX, UserPlus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UsersEmptyStateProps {
  title?: string
  description?: string
  onAction?: () => void
  actionLabel?: string
}

export function UsersEmptyState({
  title = 'No hay usuarios registrados',
  description = 'Comienza creando el primer usuario del sistema',
  onAction,
  actionLabel = 'Crear Usuario'
}: UsersEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <UserX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="gap-2">
            <UserPlus className="h-4 w-4" />
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

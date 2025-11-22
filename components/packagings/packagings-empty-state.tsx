/**
 * Componente de estado vacío para packagings
 */

import { PackageX, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface PackagingsEmptyStateProps {
  title?: string
  description?: string
  onAction?: () => void
}

export function PackagingsEmptyState({
  title = 'No hay packagings registrados',
  description = 'Comienza creando tu primer packaging',
  onAction
}: PackagingsEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="rounded-full bg-muted p-6 mb-6">
          <PackageX className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground mb-6 max-w-md">{description}</p>
        {onAction && (
          <Button onClick={onAction} className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Packaging
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

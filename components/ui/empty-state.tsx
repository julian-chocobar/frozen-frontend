import type React from "react"
/**
 * Componente EmptyState - Estado vacío
 * Muestra un mensaje cuando no hay datos
 */

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4 text-center", className)}>
      {Icon && (
        <div className="w-16 h-16 mb-4 rounded-full bg-surface-secondary flex items-center justify-center">
          <Icon className="w-8 h-8 text-muted" />
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      {description && <p className="text-sm text-muted mb-6 max-w-md">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  )
}

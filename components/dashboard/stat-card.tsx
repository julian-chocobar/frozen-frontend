/**
 * Componente StatCard - Tarjeta de estadística
 * Muestra un valor numérico con etiqueta y color opcional
 */

import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: LucideIcon
  variant?: "default" | "primary" | "alert" | "success"
  className?: string
}

const variantStyles = {
  default: "border-stroke",
  primary: "border-primary-600 border-2",
  alert: "border-alert-500 border-2",
  success: "border-success-600 border-2",
}

export function StatCard({ title, value, subtitle, icon: Icon, variant = "default", className }: StatCardProps) {
  return (
    <div className={cn("card p-6 transition-all hover:shadow-md", variantStyles[variant], className)}>
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-primary-800">{title}</h3>
        {Icon && (
          <Icon
            className={cn(
              "w-5 h-5",
              variant === "primary" && "text-primary-600",
              variant === "alert" && "text-alert-600",
              variant === "success" && "text-success-600",
              variant === "default" && "text-muted",
            )}
          />
        )}
      </div>
      <div className="mb-2">
        <p className="text-3xl font-bold text-primary-900 font-mono">{value}</p>
      </div>
      {subtitle && (
        <p
          className={cn(
            "text-sm font-medium",
            variant === "primary" && "text-primary-600",
            variant === "alert" && "text-alert-600",
            variant === "success" && "text-success-600",
            variant === "default" && "text-muted",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

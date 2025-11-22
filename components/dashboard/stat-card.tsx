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
    <div className={cn(
      "card p-6 transition-all duration-300 h-full min-h-[140px] flex flex-col",
      "hover:shadow-lg hover:-translate-y-1 hover:border-opacity-80",
      "bg-gradient-to-br from-white to-gray-50/50",
      "border-2",
      variantStyles[variant], 
      className
    )}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-semibold text-primary-700 line-clamp-2 tracking-wide">{title}</h3>
        {Icon && (
          <div className={cn(
            "flex-shrink-0 ml-2 p-2 rounded-xl transition-all duration-300",
            "shadow-sm",
            variant === "primary" && "bg-primary-50 text-primary-600",
            variant === "alert" && "bg-red-50 text-red-600",
            variant === "success" && "bg-green-50 text-green-600",
            variant === "default" && "bg-gray-100 text-gray-600",
          )}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      <div className="mb-3 flex-grow flex items-center">
        <p className={cn(
          "text-3xl font-bold font-mono tracking-tight",
          variant === "primary" && "text-primary-700",
          variant === "alert" && "text-red-700",
          variant === "success" && "text-green-700",
          variant === "default" && "text-primary-900",
        )}>
          {value}
        </p>
      </div>
      {subtitle && (
        <p
          className={cn(
            "text-xs font-medium line-clamp-2 opacity-80",
            variant === "primary" && "text-primary-600",
            variant === "alert" && "text-red-600",
            variant === "success" && "text-green-600",
            variant === "default" && "text-gray-600",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}

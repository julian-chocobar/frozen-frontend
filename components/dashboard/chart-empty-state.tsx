/**
 * Componente de estado vacío para gráficos
 * 
 * Muestra un mensaje y un icono cuando no hay datos disponibles para mostrar.
 * Proporciona feedback visual al usuario cuando no se encontraron datos.
 * 
 * @param props - Props del componente
 * @param props.icon - Componente de icono de Lucide React
 * @param props.message - Mensaje personalizado - Por defecto: "No hay datos disponibles"
 * 
 * @example
 * ```tsx
 * <ChartEmptyState icon={BarChart3} message="No hay datos disponibles" />
 * ```
 */
import type React from "react"

interface ChartEmptyStateProps {
  /** Componente de icono a mostrar (de Lucide React) */
  icon: React.ComponentType<{ className?: string }>
  /** Mensaje a mostrar - Por defecto: "No hay datos disponibles" */
  message?: string
}

export function ChartEmptyState({ icon: Icon, message = "No hay datos disponibles" }: ChartEmptyStateProps) {
  return (
    <div className="p-6">
      <div className="text-center py-12">
        <Icon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-primary-600 font-medium">{message}</p>
      </div>
    </div>
  )
}


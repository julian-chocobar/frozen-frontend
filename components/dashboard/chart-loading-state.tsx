/**
 * Componente de estado de carga para gráficos
 * 
 * Muestra un spinner animado con colores personalizables según la categoría del gráfico.
 * Utilizado mientras se cargan los datos del backend.
 * 
 * @param props - Props del componente
 * @param props.color - Color del spinner (blue, orange, red) - Por defecto: 'blue'
 * 
 * @example
 * ```tsx
 * <ChartLoadingState color="blue" />
 * ```
 */
interface ChartLoadingStateProps {
  /** Color del spinner según la categoría del gráfico */
  color?: 'blue' | 'orange' | 'red'
}

export function ChartLoadingState({ color = 'blue' }: ChartLoadingStateProps) {
  // Validar props en desarrollo
  if (process.env.NODE_ENV === 'development') {
    if (color && !['blue', 'orange', 'red'].includes(color)) {
      console.warn(
        `[ChartLoadingState] Prop 'color' debe ser 'blue', 'orange' o 'red'. ` +
        `Recibido: ${color}`
      )
    }
  }

  const colorClasses = {
    blue: 'border-blue-200 border-t-blue-600',
    orange: 'border-orange-200 border-t-orange-600',
    red: 'border-red-200 border-t-red-600',
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-center py-12">
        <div className="relative">
          <div className={`w-12 h-12 border-4 ${colorClasses[color]} rounded-full animate-spin`} />
        </div>
      </div>
    </div>
  )
}


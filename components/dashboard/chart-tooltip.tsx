/**
 * Componente de tooltip compartido para gráficos
 * 
 * Proporciona un tooltip consistente y estilizado para gráficos de Recharts.
 * Se adapta automáticamente a los colores del gráfico y muestra información formateada.
 * 
 * @param props - Props del tooltip de Recharts extendidas con opciones personalizadas
 * @param props.active - Si el tooltip está activo (mostrado)
 * @param props.payload - Datos del punto seleccionado
 * @param props.label - Label del eje X
 * @param props.unit - Unidad de medida ('L' o 'kg') - Por defecto: 'L'
 * @param props.labelText - Texto personalizado para el label del valor - Por defecto: 'Valor'
 * @param props.color - Color del borde del tooltip
 * 
 * @example
 * ```tsx
 * <Tooltip content={<ChartTooltip unit="L" labelText="Producción" color="#3b82f6" />} />
 * ```
 */
import { ChartTooltipProps } from '@/types/recharts'

export function ChartTooltip({ active, payload, label, unit = 'L', labelText, color }: ChartTooltipProps) {
  // Validar props en desarrollo
  if (process.env.NODE_ENV === 'development') {
    if (unit && !['L', 'kg'].includes(unit)) {
      console.warn(
        `[ChartTooltip] Prop 'unit' debe ser 'L' o 'kg'. Recibido: ${unit}`
      )
    }
  }

  if (!active || !payload || !payload.length) return null

  const value = payload[0].value
  const tooltipColor = color || payload[0].color || '#3b82f6'
  
  // Convertir color hex a rgba con opacidad
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }
  
  const borderColor = tooltipColor.startsWith('#') 
    ? hexToRgba(tooltipColor, 0.5)
    : tooltipColor

  return (
    <div 
      className="bg-gray-900 text-white rounded-lg shadow-xl p-3 border"
      style={{ borderColor: borderColor }}
    >
      <p className="font-semibold mb-1">{label}</p>
      <p className="text-sm">
        {labelText || 'Valor'}: <span className="font-mono font-bold">{value.toFixed(2)} {unit}</span>
      </p>
    </div>
  )
}


/**
 * Tipos TypeScript para componentes de Recharts
 * Proporciona type safety para tooltips y otros componentes personalizados
 */

import { TooltipProps } from 'recharts'

/**
 * Props para tooltips personalizados de gráficos
 */
export interface ChartTooltipProps extends TooltipProps<number, string> {
  active?: boolean
  payload?: Array<{
    value: number
    dataKey: string
    color?: string
    name?: string
    payload?: any
  }>
  label?: string
  unit?: 'L' | 'kg'
  labelText?: string
  color?: string
}

/**
 * Datos transformados para gráficos de Recharts
 */
export interface ChartDataPoint {
  name: string
  value: number
  fullValue: number
  month?: number
  year?: number
}

/**
 * Configuración de colores para gráficos
 */
export interface ChartColorConfig {
  primary: string
  light: string
  dark: string
  border: string
}

/**
 * Tipo de gráfico disponible
 */
export type ChartType = 'line' | 'bar' | 'pie'


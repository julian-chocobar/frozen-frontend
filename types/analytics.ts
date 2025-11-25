/**
 * Tipos relacionados con analíticas y reportes
 */

import type { Phase } from './phases'
import type { MaterialType } from './materials'
import type { MovementResponse } from './movements'
import type { Material } from './materials'
import type { RegistroCalidad, RegistroDesperdicio } from './quality'

// ============================================
// REPORTES Y ANALÍTICA
// ============================================

export interface EstadisticaProduccion {
  periodo: string
  lotesCompletados: number
  volumenTotal: number
  eficienciaPromedio: number
  desperdicioTotal: number
}

export interface TendenciaConsumo {
  materialId: string
  nombreMaterial: string
  categoria: MaterialType
  datos: {
    fecha: string
    cantidad: number
  }[]
}

// Analytics DTOs - Backend Analytics Module
export interface MonthlyTotalDTO {
  year?: number
  month: number | string  // Puede ser número (1-12) o string (nombre del mes)
  total: number
  monthName?: string
}

export interface DashboardStatsDTO {
  totalProduced: number
  totalWaste: number
  totalMaterialsUsed: number
  batchesInProgress: number
  batchesCancelled: number
  batchesCompleted: number
  ordersRejected: number
}

export interface AnalyticsFilters {
  startDate?: string // ISO date string
  endDate?: string // ISO date string
  productId?: string
  materialId?: string
  phase?: Phase
  transferOnly?: boolean
}


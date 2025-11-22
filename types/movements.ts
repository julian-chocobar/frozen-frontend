/**
 * Tipos relacionados con movimientos de inventario
 */

import type { MaterialType } from './materials'
import type { UnitMeasurement } from './common'

// ============================================
// MOVIMIENTOS
// ============================================
export type MovementType = "INGRESO" | "EGRESO" | "RESERVA" | "DEVUELTO"
export type MovementStatus = "PENDIENTE" | "EN_PROCESO" | "COMPLETADO"

export interface MovementResponse {
  id: string
  type: MovementType
  status: MovementStatus
  materialType: MaterialType
  stock: number
  materialName: string
  creationDate: string
  realizationDate?: string
  unitMeasurement: UnitMeasurement
  reason?: string
  location?: string
}

export interface MovementDetailResponse {
  id: string
  type: MovementType
  status: MovementStatus
  creationDate: string
  realizationDate?: string
  createdByUserId?: string
  completedByUserId?: string
  inProgressByUserId?: string
  takenAt?: string
  stock: number
  unitMeasurement: UnitMeasurement
  materialType: MaterialType
  materialCode: string
  materialName: string
  materialId: string
  reason?: string
  location: string
}

export interface MovementCreateRequest {
  type: MovementType
  materialId: string
  stock: number
  reason?: string
  location: string
}

export interface MovementsFilters {
  page?: number
  size?: number
  type?: MovementType
  status?: MovementStatus
  materialId?: string
  dateFrom?: string
  dateTo?: string
}

export interface MovementsPageResponse {
  content: MovementResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

/**
 * Tipos relacionados con órdenes de producción
 */

import type { UnitMeasurement } from './common'

// ============================================
// ORDERS
// ============================================

export type ProductionOrderStatus = "PENDIENTE" | "APROBADA" | "RECHAZADA" | "CANCELADA"

export interface ProductionOrderResponse {
  id: string
  batchId: string
  batchCode: string
  packagingName: string
  productName: string
  status: ProductionOrderStatus
  validationDate: string
  quantity: number
  unitMeasurement: UnitMeasurement
  plannedDate: string
  startDate: string
  estimatedCompletedDate: string
  completedDate: string
  createdByUserName: string
  createdByUserId: string
  approvedByUserName?: string
  approvedByUserId?: string
}

export interface ProductionOrderCreateRequest {
  productId: number
  packagingId: number
  quantity: number
  plannedDate: string // ISO 8601 OffsetDateTime, ej: 2025-10-31T00:00:00-03:00
}

export interface ProductionOrderFilters {
  page?: number
  size?: number
  status?: ProductionOrderStatus
  productId?: string
}

export interface ProductionOrderPageResponse {
  content: ProductionOrderResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

export interface OrdenProduccion {
  id: string
  codigo: string // Ej: "OP-2025-001"
  nombreProducto: string
  volumen: number
  fechaCreacion: string
  fechaPlanificada: string
  estado: "Pendiente" | "En Proceso" | "Completada" | "Cancelada"
  lotes: string[] // IDs de lotes asociados
}

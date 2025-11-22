/**
 * Tipos relacionados con lotes de producción
 */

import type { EtapaProduccion } from './phases'

// ============================================
// BATCHES
// ============================================

export type BatchStatus = "PENDIENTE" | "EN_PRODUCCION" | "EN_ESPERA" | "COMPLETADO" | "CANCELADO"

export interface BatchResponse {
  id: string
  code: string
  packagingName: string
  productName: string
  orderId: string
  productId: string
  status: BatchStatus
  quantity: number
  creationDate: string
  plannedDate: string
  startDate: string
  estimatedCompletedDate: string
  completedDate: string
  assignedUserName: string
  assignedUserId: string
}

export interface BatchFilters {
  page?: number
  size?: number
  status?: BatchStatus
  productId?: string
}

export interface BatchPageResponse {
  content: BatchResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

export interface MaterialAsignado {
  materialId: string
  nombreMaterial: string
  cantidadPlanificada: number
  cantidadUsada?: number
  unidad: string
}

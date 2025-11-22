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

export type EstadoLote =
  | "Planificado"
  | "En Producción"
  | "Fermentación"
  | "Maduración"
  | "Envasado"
  | "Completado"
  | "Cancelado"

export interface LoteProduccion {
  id: string
  codigo: string // Ej: "LOTE-001"
  ordenProduccionId: string // Ej: "OP-2025-001"
  nombreProducto: string // Ej: "IPA Americana"
  tipoProducto: string // Ej: "IPA Americana - 485L"
  volumenObjetivo: number // En litros
  volumenReal?: number
  estado: EstadoLote
  etapaActual: EtapaProduccion
  progreso: number // 0-100
  fechaInicio: string // ISO date
  fechaFinEstimada: string // ISO date
  fechaFinReal?: string
  responsable: string
  temperatura?: number // Temperatura actual
  ph?: number // pH actual
  alertas?: string[] // Alertas activas
  materiales: MaterialAsignado[]
}

export interface MaterialAsignado {
  materialId: string
  nombreMaterial: string
  cantidadPlanificada: number
  cantidadUsada?: number
  unidad: string
}

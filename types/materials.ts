/**
 * Tipos relacionados con materiales y materias primas
 */

import type { UnitMeasurement, WarehouseZone, WarehouseLevel } from './common'

// ============================================
// MATERIAS PRIMAS
// ============================================
export type MaterialType = "MALTA" | "LUPULO" | "AGUA" | "LEVADURA" | "ENVASE" | "ETIQUETADO" | "OTROS"

export type MaterialStatus = "Activo" | "Inactivo"

// Tipo para la API del backend (coincide exactamente con lo que recibes)
export interface Material {
  id: string
  code: string
  name: string
  type: MaterialType
  supplier?: string
  value?: number
  totalStock?: number
  reservedStock?: number
  availableStock?: number
  unitMeasurement: UnitMeasurement
  threshold: number
  isBelowThreshold: boolean
  isActive: boolean
  minimumStock?: number
  maximumStock?: number
  currentStock?: number
  warehouseZone?: WarehouseZone
  warehouseSection?: string
  warehouseLevel?: WarehouseLevel
  warehouseX?: number
  warehouseY?: number
}

// Tipo para crear material (coincide con POST /api/materials)
export interface MaterialCreateRequest {
  name: string
  type: MaterialType
  unitMeasurement: UnitMeasurement  
  threshold: number
  supplier?: string // Opcional
  value?: number // Opcional, debe ser > 0
  stock?: number // Opcional, debe ser > 0
  warehouseZone?: WarehouseZone
  warehouseSection?: string
  warehouseLevel?: WarehouseLevel
  warehouseX?: number
  warehouseY?: number
}

// Tipo para actualizar material (coincide con PATCH /api/materials/{id})
export interface MaterialUpdateRequest {
  name?: string
  type?: MaterialType
  supplier?: string
  value?: number // Debe ser > 0
  unitMeasurement?: UnitMeasurement
  threshold?: number // Debe ser > 0
  warehouseZone?: WarehouseZone
  warehouseSection?: string
  warehouseLevel?: WarehouseLevel
}

// Respuesta paginada de la API (estructura real del backend)
export interface MaterialsPageResponse {
  content: Material[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

//Detalle para el detalle de materiales 
export interface MaterialDetailResponse {
  id: string
  code: string
  name: string
  type: MaterialType
  supplier?: string
  value?: number
  totalStock?: number
  availableStock?: number
  reservedStock?: number
  unitMeasurement: UnitMeasurement
  threshold: number
  isBelowThreshold: boolean
  isActive: boolean
  creationDate: string
  lastUpdateDate: string
  minimumStock?: number
  maximumStock?: number
  currentStock?: number
  warehouseZone?: string
  warehouseSection?: string | number
  warehouseLevel?: number
  warehouseX?: number
  warehouseY?: number
}

// Filtros para la API (coincide con los parámetros del backend)
export interface MaterialsFilters {
  page?: number
  size?: number
  name?: string
  supplier?: string
  type?: MaterialType
  isActive?: boolean
}

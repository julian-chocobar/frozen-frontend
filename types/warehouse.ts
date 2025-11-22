/**
 * Tipos relacionados con almacén y ubicaciones
 */

import type { MaterialType } from './materials'
import type { WarehouseZone, WarehouseLevel } from './common'

// ============================================
// SISTEMA DE ALMACÉN SIMPLIFICADO
// ============================================

// Secciones disponibles por zona
export interface WarehouseZoneSections {
  MALTA: string[]
  LUPULO: string[]
  LEVADURA: string[]
  AGUA: string[]
  ENVASE: string[]
  ETIQUETADO: string[]
  OTROS: string[]
}

export interface WarehouseLocation {
  zone: WarehouseZone
  section: string
  level: WarehouseLevel
}

// ============================================
// WAREHOUSE
// ============================================

export interface WarehouseDimensions {
  width: number
  height: number
  unit: string
}

export interface WarehouseBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface WarehouseSectionDimensions {
  width: number
  height: number
}

export interface WarehouseSpacing {
  x: number
  y: number
}

export interface WarehouseZoneConfig {
  bounds: WarehouseBounds
  sectionSize: WarehouseSectionDimensions
  sectionSpacing: WarehouseSpacing
  maxSectionsPerRow: number
  maxRows: number
  priority: number
  description: string
}

export interface WarehouseConfigResponse {
  dimensions: WarehouseDimensions
  zones: Record<string, WarehouseZoneConfig>
  walkways: unknown[]
  doors: unknown[]
}

export interface WarehouseLocationValidationRequest {
  zone: string
  section: string
}

export interface WarehouseLocationValidationResponse {
  isValid: boolean
  coordinates?: {
    x: number
    y: number
  }
  message?: string
}

export interface WarehouseZoneSections {
  zone: string
  sections: string[]
  totalSections: number
  layout: string
}

export interface WarehouseZoneConfigUpdateRequest {
  maxSectionsPerRow: number
  maxRows: number
  sectionWidth: number
  sectionHeight: number
  spacingX: number
  spacingY: number
  description: string
}

export interface WarehouseZoneConfigUpdateResponse {
  bounds: WarehouseBounds
  sectionSize: WarehouseSectionDimensions
  sectionSpacing: WarehouseSpacing
  maxSectionsPerRow: number
  maxRows: number
  priority: number
  description: string
}

export interface MaterialWarehouseLocation {
  id?: number
  materialId?: number
  code?: string
  materialCode?: string
  name?: string
  materialName?: string
  type?: MaterialType
  materialType?: MaterialType
  stock?: number
  currentStock?: number
  reservedStock?: number
  threshold?: number
  minimumStock?: number
  isBelowThreshold?: boolean
  warehouseX?: number
  warehouseY?: number
  warehouseZone?: string
  warehouseSection?: string | number
  warehouseLevel?: number
}

export interface MaterialWarehouseLocationUpdateRequest {
  warehouseX: number
  warehouseY: number
  warehouseZone: string
  warehouseSection: string
  warehouseLevel: number
}

export interface WarehouseSuggestedLocation {
  zone: string
  section: string
  x: number
  y: number
  level: number
}

export type WarehouseAvailableZone =
  | string
  | {
      name: string
      totalSections?: number
      occupiedSections?: number
      recommendedForTypes?: string[]
    }

export type WarehouseSectionsByZone =
  | Record<string, string[]>
  | Array<{ zone: string; sections: string[] }>

export interface WarehouseInfoResponse {
  availableZones: WarehouseAvailableZone[]
  sectionsByZone: WarehouseSectionsByZone
  suggestedLocation?: WarehouseSuggestedLocation
  totalMaterials?: number
  materialsByZone?: Record<string, number>
}

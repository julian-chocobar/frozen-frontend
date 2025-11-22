/**
 * Tipos relacionados con envases y embalajes
 */

import type { UnitMeasurement } from './common'

// ============================================
// PACKAGINGS
// ============================================
export interface PackagingResponse {
  id: string
  name: string
  packagingMaterialName: string 
  labelingMaterialName: string
  unitMeasurement: UnitMeasurement
  quantity: number
  isActive: boolean 
}

export interface PackagingCreateRequest {
  name: string
  packagingMaterialId: string
  labelingMaterialId: string
  unitMeasurement: UnitMeasurement
  quantity: number  
}

export interface PackagingUpdateRequest {
  name?: string
  packagingMaterialId?: string
  labelingMaterialId?: string
  unitMeasurement?: UnitMeasurement
  quantity?: number
}

export interface PackagingPageResponse {
  content: PackagingResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

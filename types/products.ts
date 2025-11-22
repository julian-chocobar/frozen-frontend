/**
 * Tipos relacionados con productos
 */

import type { UnitMeasurement } from './common'

// ============================================
// PRODUCTOS
// ============================================

export type ProductStatus = "Activo" | "Inactivo"
export type ProductReady = "Listo" | "No Listo"
export type ProductAlcoholic = "Alcoholico" | "No Alcoholico"

export interface ProductResponse {
  id: string
  name: string
  isAlcoholic: boolean
  isActive: boolean
  isReady: boolean
  creationDate: string
  standardQuantity: number  
  unitMeasurement: UnitMeasurement 
}

export interface ProductCreateRequest {
  name: string
  isAlcoholic: boolean
  standardQuantity: number
  unitMeasurement: UnitMeasurement
}

export interface ProductUpdateRequest {
  name?: string
  isAlcoholic?: boolean
  standardQuantity?: number
  unitMeasurement?: UnitMeasurement
}

export interface ProductPageResponse {
  content: ProductResponse[]
  isFirst: boolean
  totalItems: number
  size: number
  isLast: boolean
  totalPages: number
  hasPrevious: boolean
  hasNext: boolean
  currentPage: number
}

export interface ProductsFilters {
  page?: number
  size?: number
  name?: string
  isAlcoholic?: boolean
  isActive?: boolean
  isReady?: boolean
  standardQuantity?: number
  unitMeasurement?: UnitMeasurement
}

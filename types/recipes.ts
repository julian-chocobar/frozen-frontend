/**
 * Tipos relacionados con recetas
 */

import type { UnitMeasurement } from './common'

// ============================================
// RECIPES
// ============================================

export interface RecipeCreateRequest {
  productPhaseId: string
  materialId: string
  quantity: number
}

export interface RecipeResponse {
  id: string
  productPhaseId: string
  materialName: string
  materialCode: string
  materialUnit: UnitMeasurement
  quantity: number
}

export interface RecipeUpdateRequest {
  materialId?: string
  quantity?: number
}

/**
 * Utilidades para validar que los tipos coincidan con el backend
 */

import type { Material, MaterialCreateRequest, MaterialType, UnitMeasurement } from '@/types'

/**
 * Valida que un objeto tenga la estructura correcta de Material
 */
export function validateMaterial(obj: any): obj is Material {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.code === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.type === 'number' &&
    obj.type >= 0 && obj.type <= 4 &&
    typeof obj.supplier === 'string' &&
    typeof obj.value === 'number' &&
    typeof obj.stock === 'number' &&
    typeof obj.unitMeasurement === 'string' &&
    (obj.unitMeasurement === 'KG' || obj.unitMeasurement === 'LT') &&
    typeof obj.threshold === 'number' &&
    typeof obj.isActive === 'boolean' &&
    typeof obj.creationDate === 'string' &&
    typeof obj.lastUpdateDate === 'string'
  )
}

/**
 * Valida que un objeto tenga la estructura correcta de MaterialCreateRequest
 */
export function validateMaterialCreateRequest(obj: any): obj is MaterialCreateRequest {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.code === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.type === 'number' &&
    obj.type >= 0 && obj.type <= 4 &&
    typeof obj.supplier === 'string' &&
    typeof obj.value === 'number' &&
    typeof obj.stock === 'number' &&
    typeof obj.unitMeasurement === 'string' &&
    (obj.unitMeasurement === 'KG' || obj.unitMeasurement === 'LT') &&
    typeof obj.threshold === 'number'
  )
}

/**
 * Mapea tipos numéricos a strings legibles
 */
export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  'MALTA': 'Malta',
  'LUPULO': 'Lúpulo',
  'AGUA': 'Agua',
  'LEVADURA': 'Levadura',
  'ENVASE': 'Envase',
  'OTROS': 'Otros',
}

/**
 * Mapea unidades de medida a strings legibles
 */
export const UNIT_MEASUREMENT_LABELS: Record<UnitMeasurement, string> = {
  'KG': 'Kilogramos',
  'LT': 'Litros',
  'UNIDAD': 'Unidad'
}

/**
 * Valida que la respuesta de la API tenga la estructura correcta
 */
export function validateMaterialsPageResponse(obj: any): boolean {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    Array.isArray(obj.content) &&
    typeof obj.pageable === 'object' &&
    typeof obj.totalPages === 'number' &&
    typeof obj.totalElements === 'number' &&
    typeof obj.last === 'boolean' &&
    typeof obj.size === 'number' &&
    typeof obj.number === 'number' &&
    typeof obj.first === 'boolean' &&
    typeof obj.empty === 'boolean'
  )
}

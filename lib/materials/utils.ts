/**
 * Utilidades compartidas para el módulo de materiales
 * Funciones reutilizables para formateo, validación y transformación de datos
 */

import type { Material, MaterialDetailResponse, MaterialType, UnitMeasurement } from '@/types'

/**
 * Formatea el código de un material con prefijo y padding
 * 
 * @example
 * ```typescript
 * formatMaterialCode('MAT', 123) // => 'MAT-0123'
 * ```
 */
export function formatMaterialCode(prefix: string, id: number): string {
  return `${prefix}-${id.toString().padStart(4, '0')}`
}

/**
 * Valida si el stock de un material está por debajo del umbral
 * 
 * @param availableStock - Stock disponible actual
 * @param threshold - Umbral mínimo configurado
 * @returns true si el stock está por debajo del umbral
 * 
 * @example
 * ```typescript
 * isStockBelowThreshold(50, 100) // => true
 * isStockBelowThreshold(150, 100) // => false
 * ```
 */
export function isStockBelowThreshold(availableStock: number, threshold: number): boolean {
  return availableStock < threshold
}

/**
 * Calcula el valor total del stock de un material
 * 
 * @param stock - Cantidad en stock
 * @param unitValue - Valor unitario
 * @returns Valor total del stock
 * 
 * @example
 * ```typescript
 * calculateTotalStockValue(100, 25.50) // => 2550
 * ```
 */
export function calculateTotalStockValue(stock: number, unitValue: number): number {
  return stock * unitValue
}

/**
 * Calcula el porcentaje de stock reservado respecto al total
 * 
 * @param reservedStock - Stock reservado
 * @param totalStock - Stock total
 * @returns Porcentaje de reserva (0-100)
 * 
 * @example
 * ```typescript
 * calculateReservedPercentage(25, 100) // => 25
 * ```
 */
export function calculateReservedPercentage(reservedStock: number, totalStock: number): number {
  if (totalStock === 0) return 0
  return Math.round((reservedStock / totalStock) * 100)
}

/**
 * Formatea un valor de stock con su unidad de medida
 * 
 * @param value - Valor numérico
 * @param unit - Unidad de medida
 * @param includeDecimals - Si debe incluir decimales
 * @returns String formateado con valor y unidad
 * 
 * @example
 * ```typescript
 * formatStockValue(150.5, 'KG', true) // => '150.50 kg'
 * formatStockValue(150.5, 'KG', false) // => '151 kg'
 * ```
 */
export function formatStockValue(
  value: number, 
  unit: UnitMeasurement, 
  includeDecimals: boolean = true
): string {
  const unitLabels: Record<UnitMeasurement, string> = {
    'KG': 'kg',
    'LT': 'L',
    'UNIDAD': 'unidad(es)'
  }

  const formattedValue = includeDecimals 
    ? value.toFixed(2)
    : Math.round(value).toString()

  return `${formattedValue} ${unitLabels[unit]}`
}

/**
 * Determina la clase CSS para el estado del stock según el umbral
 * 
 * @param availableStock - Stock disponible
 * @param threshold - Umbral mínimo
 * @returns Objeto con clases CSS para texto y fondo
 * 
 * @example
 * ```typescript
 * getStockStatusClass(50, 100) // => { text: 'text-red-700', bg: 'bg-red-100' }
 * ```
 */
export function getStockStatusClass(availableStock: number, threshold: number) {
  const isCritical = availableStock < threshold * 0.5 // Menos del 50% del umbral
  const isLow = availableStock < threshold
  
  if (isCritical) {
    return {
      text: 'text-red-700',
      bg: 'bg-red-100',
      border: 'border-red-300',
      status: 'critical' as const
    }
  }
  
  if (isLow) {
    return {
      text: 'text-orange-700',
      bg: 'bg-orange-100',
      border: 'border-orange-300',
      status: 'low' as const
    }
  }
  
  return {
    text: 'text-green-700',
    bg: 'bg-green-100',
    border: 'border-green-300',
    status: 'normal' as const
  }
}

/**
 * Valida los datos de un material antes de crear/actualizar
 * 
 * @param material - Datos del material a validar
 * @returns Objeto con validez y errores
 * 
 * @example
 * ```typescript
 * validateMaterialData({ name: '', code: 'MAT001' })
 * // => { valid: false, errors: { name: 'El nombre es requerido' } }
 * ```
 */
export function validateMaterialData(material: Partial<Material | MaterialDetailResponse>): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  // Validaciones básicas
  if (!material.name || material.name.trim() === '') {
    errors.name = 'El nombre es requerido'
  }

  if (!material.code || material.code.trim() === '') {
    errors.code = 'El código es requerido'
  }

  if (material.code && material.code.length > 20) {
    errors.code = 'El código no puede exceder 20 caracteres'
  }

  if (!material.type) {
    errors.type = 'El tipo de material es requerido'
  }

  if (!material.unitMeasurement) {
    errors.unitMeasurement = 'La unidad de medida es requerida'
  }

  if (material.value !== undefined && material.value < 0) {
    errors.value = 'El valor no puede ser negativo'
  }

  if (material.threshold !== undefined && material.threshold < 0) {
    errors.threshold = 'El umbral no puede ser negativo'
  }

  if (material.availableStock !== undefined && material.availableStock < 0) {
    errors.availableStock = 'El stock disponible no puede ser negativo'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Ordena materiales por múltiples criterios
 * 
 * @param materials - Array de materiales
 * @param sortBy - Campo por el cual ordenar
 * @param order - Orden ascendente o descendente
 * @returns Array ordenado de materiales
 * 
 * @example
 * ```typescript
 * sortMaterials(materials, 'name', 'asc')
 * ```
 */
export function sortMaterials(
  materials: Material[],
  sortBy: keyof Material,
  order: 'asc' | 'desc' = 'asc'
): Material[] {
  return [...materials].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    // Handle undefined values
    if (aValue == null && bValue == null) return 0
    if (aValue == null) return 1
    if (bValue == null) return -1

    if (aValue === bValue) return 0

    const comparison = aValue < bValue ? -1 : 1
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Filtra materiales según múltiples criterios
 * 
 * @param materials - Array de materiales
 * @param filters - Objeto con filtros a aplicar
 * @returns Array filtrado de materiales
 * 
 * @example
 * ```typescript
 * filterMaterials(materials, { 
 *   type: 'MALTA', 
 *   isActive: true,
 *   searchTerm: 'pilsen' 
 * })
 * ```
 */
export function filterMaterials(
  materials: Material[],
  filters: {
    type?: MaterialType | 'Todas'
    isActive?: boolean
    searchTerm?: string
    supplier?: string
  }
): Material[] {
  return materials.filter(material => {
    // Filtro por tipo
    if (filters.type && filters.type !== 'Todas' && material.type !== filters.type) {
      return false
    }

    // Filtro por estado
    if (filters.isActive !== undefined && material.isActive !== filters.isActive) {
      return false
    }

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase()
      const matchesName = material.name.toLowerCase().includes(term)
      const matchesCode = material.code.toLowerCase().includes(term)
      if (!matchesName && !matchesCode) {
        return false
      }
    }

    // Filtro por proveedor
    if (filters.supplier && material.supplier !== filters.supplier) {
      return false
    }

    return true
  })
}

/**
 * Obtiene un resumen de estadísticas de materiales
 * 
 * @param materials - Array de materiales
 * @returns Objeto con estadísticas agregadas
 * 
 * @example
 * ```typescript
 * getMaterialsStats(materials)
 * // => { 
 * //   total: 150, 
 * //   active: 140, 
 * //   inactive: 10,
 * //   lowStock: 5,
 * //   totalValue: 25000 
 * // }
 * ```
 */
export function getMaterialsStats(materials: Material[]) {
  return materials.reduce((stats, material) => {
    stats.total++
    
    if (material.isActive) {
      stats.active++
    } else {
      stats.inactive++
    }
    
    if (material.availableStock !== undefined && material.threshold !== undefined && 
        isStockBelowThreshold(material.availableStock, material.threshold)) {
      stats.lowStock++
    }
    
    stats.totalValue += calculateTotalStockValue(material.totalStock !== undefined ? material.totalStock : 0, material.value !== undefined ? material.value : 0)
    
    return stats
  }, {
    total: 0,
    active: 0,
    inactive: 0,
    lowStock: 0,
    totalValue: 0
  })
}

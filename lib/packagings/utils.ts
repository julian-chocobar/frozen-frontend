/**
 * Utilidades para el módulo de packagings
 * Contiene funciones reutilizables para formateo, validación y transformación de datos
 */

import type { PackagingResponse, UnitMeasurement } from '@/types'
import { Package, Box, CheckCircle, XCircle } from 'lucide-react'

type IconComponent = typeof Package

/**
 * Obtiene el texto legible para el estado activo
 * @param isActive - Si el packaging está activo
 * @returns Texto del estado
 * @example
 * getActiveText(true) // 'Activo'
 */
export function getActiveText(isActive: boolean): string {
  return isActive ? 'Activo' : 'Inactivo'
}

/**
 * Obtiene el icono para packaging
 * @returns Componente de icono
 * @example
 * const Icon = getPackagingIcon()
 * <Icon className="w-4 h-4" />
 */
export function getPackagingIcon(): IconComponent {
  return Box
}

/**
 * Obtiene la configuración de badge para estado activo
 * @param isActive - Si el packaging está activo
 * @returns Objeto con clase CSS, etiqueta e icono
 * @example
 * const config = getActiveBadgeConfig(true)
 */
export function getActiveBadgeConfig(isActive: boolean) {
  return isActive ? {
    className: 'bg-green-100 text-green-800 border-green-300',
    label: 'Activo',
    icon: CheckCircle
  } : {
    className: 'bg-gray-100 text-gray-800 border-gray-300',
    label: 'Inactivo',
    icon: XCircle
  }
}

/**
 * Formatea la unidad de medida a texto legible
 * @param unit - Unidad de medida
 * @returns String formateado
 * @example
 * formatUnitMeasurement('KG') // 'kg'
 */
export function formatUnitMeasurement(unit: UnitMeasurement): string {
  const unitLabels: Record<UnitMeasurement, string> = {
    'KG': 'kg',
    'LT': 'L',
    'UNIDAD': 'unidad'
  }
  return unitLabels[unit] || unit
}

/**
 * Formatea la cantidad con unidad
 * @param quantity - Cantidad numérica
 * @param unit - Unidad de medida
 * @returns String formateado
 * @example
 * formatPackagingQuantity(500, 'LT') // '500 L'
 */
export function formatPackagingQuantity(quantity: number, unit: UnitMeasurement): string {
  return `${quantity.toLocaleString('es-ES')} ${formatUnitMeasurement(unit)}`
}

/**
 * Valida si los datos de un packaging son válidos
 * @param packaging - Packaging a validar
 * @returns true si tiene datos válidos
 * @example
 * validatePackagingData(packaging) // true
 */
export function validatePackagingData(packaging: PackagingResponse): boolean {
  return !!(
    packaging.id &&
    packaging.name &&
    packaging.quantity > 0 &&
    packaging.unitMeasurement
  )
}

/**
 * Filtra packagings por estado activo
 * @param packagings - Array de packagings
 * @param isActive - Estado a filtrar
 * @returns Array filtrado
 * @example
 * filterPackagingsByActive(packagings, true)
 */
export function filterPackagingsByActive(
  packagings: PackagingResponse[],
  isActive: boolean
): PackagingResponse[] {
  return packagings.filter(p => p.isActive === isActive)
}

/**
 * Filtra packagings por unidad de medida
 * @param packagings - Array de packagings
 * @param unit - Unidad a filtrar
 * @returns Array filtrado
 * @example
 * filterPackagingsByUnit(packagings, 'KG')
 */
export function filterPackagingsByUnit(
  packagings: PackagingResponse[],
  unit: UnitMeasurement
): PackagingResponse[] {
  return packagings.filter(p => p.unitMeasurement === unit)
}

/**
 * Calcula estadísticas de packagings
 * @param packagings - Array de packagings
 * @returns Objeto con contadores
 * @example
 * const stats = calculatePackagingStats(packagings)
 */
export function calculatePackagingStats(packagings: PackagingResponse[]) {
  return {
    total: packagings.length,
    active: filterPackagingsByActive(packagings, true).length,
    inactive: filterPackagingsByActive(packagings, false).length,
    byUnit: {
      kg: filterPackagingsByUnit(packagings, 'KG').length,
      lt: filterPackagingsByUnit(packagings, 'LT').length,
      unidad: filterPackagingsByUnit(packagings, 'UNIDAD').length
    }
  }
}

/**
 * Ordena packagings alfabéticamente
 * @param packagings - Array de packagings
 * @returns Array ordenado
 * @example
 * sortPackagingsByName(packagings)
 */
export function sortPackagingsByName(
  packagings: PackagingResponse[]
): PackagingResponse[] {
  return [...packagings].sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

/**
 * Busca packagings por nombre
 * @param packagings - Array de packagings
 * @param searchTerm - Término de búsqueda
 * @returns Array filtrado
 * @example
 * searchPackagingsByName(packagings, 'botella')
 */
export function searchPackagingsByName(
  packagings: PackagingResponse[],
  searchTerm: string
): PackagingResponse[] {
  const term = searchTerm.toLowerCase().trim()
  if (!term) return packagings
  
  return packagings.filter(p => 
    p.name.toLowerCase().includes(term)
  )
}

/**
 * Obtiene un resumen del packaging
 * @param packaging - Packaging
 * @returns String con resumen
 * @example
 * getPackagingSummary(packaging) // 'Botella 500ml - 500 L - Activo'
 */
export function getPackagingSummary(packaging: PackagingResponse): string {
  const parts = [
    packaging.name,
    formatPackagingQuantity(packaging.quantity, packaging.unitMeasurement),
    getActiveText(packaging.isActive)
  ]
  return parts.join(' - ')
}

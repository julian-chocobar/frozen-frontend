/**
 * Utilidades para el módulo de productos
 * Contiene funciones reutilizables para formateo, validación y transformación de datos
 */

import type { ProductResponse, ProductAlcoholic, ProductStatus, ProductReady } from '@/types'
import { Beer, Droplet, CheckCircle, XCircle } from 'lucide-react'

type IconComponent = typeof Beer

/**
 * Obtiene el texto legible para el estado de alcohol
 * @param isAlcoholic - Si el producto es alcohólico
 * @returns Texto del tipo alcohólico
 * @example
 * getAlcoholicText(true) // 'Alcohólico'
 */
export function getAlcoholicText(isAlcoholic: boolean): string {
  return isAlcoholic ? 'Alcohólico' : 'No Alcohólico'
}

/**
 * Obtiene el texto legible para el estado activo
 * @param isActive - Si el producto está activo
 * @returns Texto del estado
 * @example
 * getActiveText(true) // 'Activo'
 */
export function getActiveText(isActive: boolean): string {
  return isActive ? 'Activo' : 'Inactivo'
}

/**
 * Obtiene el texto legible para el estado listo
 * @param isReady - Si el producto está listo para producción
 * @returns Texto del estado
 * @example
 * getReadyText(true) // 'Listo para Producción'
 */
export function getReadyText(isReady: boolean): string {
  return isReady ? 'Listo para Producción' : 'No Listo'
}

/**
 * Obtiene el icono correspondiente a un producto
 * @param isAlcoholic - Si el producto es alcohólico
 * @returns Componente de icono de Lucide
 * @example
 * const Icon = getProductIcon(true)
 * <Icon className="w-4 h-4" />
 */
export function getProductIcon(isAlcoholic: boolean): IconComponent {
  return isAlcoholic ? Beer : Droplet
}

/**
 * Obtiene la configuración de badge para estado alcohólico
 * @param isAlcoholic - Si el producto es alcohólico
 * @returns Objeto con clase CSS y etiqueta
 * @example
 * const config = getAlcoholicBadgeConfig(true)
 * // { className: 'bg-amber-100...', label: 'Alcohólico' }
 */
export function getAlcoholicBadgeConfig(isAlcoholic: boolean) {
  return isAlcoholic ? {
    className: 'bg-amber-100 text-amber-800 border-amber-300',
    label: 'Alcohólico'
  } : {
    className: 'bg-blue-100 text-blue-800 border-blue-300',
    label: 'No Alcohólico'
  }
}

/**
 * Obtiene la configuración de badge para estado activo
 * @param isActive - Si el producto está activo
 * @returns Objeto con clase CSS y etiqueta
 * @example
 * const config = getActiveBadgeConfig(true)
 * // { className: 'bg-green-100...', label: 'Activo' }
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
 * Obtiene la configuración de badge para estado listo
 * @param isReady - Si el producto está listo
 * @returns Objeto con clase CSS y etiqueta
 * @example
 * const config = getReadyBadgeConfig(true)
 * // { className: 'bg-green-100...', label: 'Listo' }
 */
export function getReadyBadgeConfig(isReady: boolean) {
  return isReady ? {
    className: 'bg-green-100 text-green-800 border-green-300',
    label: 'Listo',
    icon: CheckCircle
  } : {
    className: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    label: 'No Listo',
    icon: XCircle
  }
}

/**
 * Formatea la cantidad estándar con su unidad de medida
 * @param quantity - Cantidad numérica
 * @param unit - Unidad de medida
 * @returns String formateado con cantidad y unidad
 * @example
 * formatProductQuantity(500, 'LT') // '500 L'
 * formatProductQuantity(25, 'KG') // '25 kg'
 */
export function formatProductQuantity(quantity: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    'KG': 'kg',
    'LT': 'L',
    'UNIDAD': 'unidades'
  }
  
  return `${quantity.toLocaleString('es-ES')} ${unitLabels[unit] || unit}`
}

/**
 * Formatea una fecha ISO a formato legible en español
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada o "No definida" si es inválida
 * @example
 * formatProductDate('2025-11-22T10:30:00') // '22 nov 2025'
 */
export function formatProductDate(dateString: string | null | undefined): string {
  if (!dateString) return 'No definida'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha inválida'
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  } catch {
    return 'Fecha inválida'
  }
}

/**
 * Valida si los datos de un producto son válidos
 * @param product - Producto a validar
 * @returns true si el producto tiene datos válidos
 * @example
 * validateProductData(product) // true si tiene campos requeridos
 */
export function validateProductData(product: ProductResponse): boolean {
  return !!(
    product.id &&
    product.name &&
    product.standardQuantity > 0 &&
    product.unitMeasurement
  )
}

/**
 * Filtra productos por estado activo
 * @param products - Array de productos
 * @param isActive - Estado activo a filtrar
 * @returns Array filtrado de productos
 * @example
 * filterProductsByActive(products, true) // Solo activos
 */
export function filterProductsByActive(
  products: ProductResponse[],
  isActive: boolean
): ProductResponse[] {
  return products.filter(product => product.isActive === isActive)
}

/**
 * Filtra productos por tipo alcohólico
 * @param products - Array de productos
 * @param isAlcoholic - Tipo alcohólico a filtrar
 * @returns Array filtrado de productos
 * @example
 * filterProductsByAlcoholic(products, true) // Solo alcohólicos
 */
export function filterProductsByAlcoholic(
  products: ProductResponse[],
  isAlcoholic: boolean
): ProductResponse[] {
  return products.filter(product => product.isAlcoholic === isAlcoholic)
}

/**
 * Filtra productos listos para producción
 * @param products - Array de productos
 * @param isReady - Estado listo a filtrar
 * @returns Array filtrado de productos
 * @example
 * filterProductsByReady(products, true) // Solo listos
 */
export function filterProductsByReady(
  products: ProductResponse[],
  isReady: boolean
): ProductResponse[] {
  return products.filter(product => product.isReady === isReady)
}

/**
 * Calcula estadísticas de productos
 * @param products - Array de productos
 * @returns Objeto con contadores por categoría
 * @example
 * const stats = calculateProductStats(products)
 * // { total: 10, active: 8, inactive: 2, alcoholic: 6, nonAlcoholic: 4, ready: 7, notReady: 3 }
 */
export function calculateProductStats(products: ProductResponse[]) {
  return {
    total: products.length,
    active: filterProductsByActive(products, true).length,
    inactive: filterProductsByActive(products, false).length,
    alcoholic: filterProductsByAlcoholic(products, true).length,
    nonAlcoholic: filterProductsByAlcoholic(products, false).length,
    ready: filterProductsByReady(products, true).length,
    notReady: filterProductsByReady(products, false).length
  }
}

/**
 * Ordena productos alfabéticamente por nombre
 * @param products - Array de productos
 * @returns Array ordenado de productos
 * @example
 * sortProductsByName(products) // Ordenados A-Z
 */
export function sortProductsByName(
  products: ProductResponse[]
): ProductResponse[] {
  return [...products].sort((a, b) => a.name.localeCompare(b.name, 'es'))
}

/**
 * Ordena productos por fecha de creación (más reciente primero)
 * @param products - Array de productos
 * @returns Array ordenado de productos
 * @example
 * sortProductsByDate(products) // Más recientes primero
 */
export function sortProductsByDate(
  products: ProductResponse[]
): ProductResponse[] {
  return [...products].sort((a, b) => {
    const dateA = new Date(a.creationDate).getTime()
    const dateB = new Date(b.creationDate).getTime()
    return dateB - dateA // Más reciente primero
  })
}

/**
 * Busca productos por nombre (búsqueda parcial, case-insensitive)
 * @param products - Array de productos
 * @param searchTerm - Término de búsqueda
 * @returns Array filtrado de productos que coinciden con la búsqueda
 * @example
 * searchProductsByName(products, 'ipa') // Productos que contengan 'ipa'
 */
export function searchProductsByName(
  products: ProductResponse[],
  searchTerm: string
): ProductResponse[] {
  const term = searchTerm.toLowerCase().trim()
  if (!term) return products
  
  return products.filter(product => 
    product.name.toLowerCase().includes(term)
  )
}

/**
 * Obtiene un resumen descriptivo del producto
 * @param product - Producto
 * @returns String con resumen del producto
 * @example
 * getProductSummary(product) // 'IPA Americana - Alcohólico - 500 L'
 */
export function getProductSummary(product: ProductResponse): string {
  const parts = [
    product.name,
    getAlcoholicText(product.isAlcoholic),
    formatProductQuantity(product.standardQuantity, product.unitMeasurement)
  ]
  return parts.join(' - ')
}

/**
 * Verifica si un producto puede ser eliminado
 * @param product - Producto a verificar
 * @returns true si el producto puede ser eliminado (inactivo)
 * @example
 * canDeleteProduct(product) // true si no está activo
 */
export function canDeleteProduct(product: ProductResponse): boolean {
  return !product.isActive
}

/**
 * Verifica si un producto puede ser activado/desactivado
 * @param product - Producto a verificar
 * @returns true si el producto puede cambiar de estado
 * @example
 * canToggleProductStatus(product) // true siempre
 */
export function canToggleProductStatus(product: ProductResponse): boolean {
  return true // Siempre se puede cambiar el estado
}

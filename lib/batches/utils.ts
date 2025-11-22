/**
 * Utilidades para el módulo de lotes (batches)
 * Contiene funciones reutilizables para formateo, validación y transformación de datos
 */

import type { BatchResponse, BatchStatus } from '@/types'
import { Package, Play, Pause, CheckCircle, XCircle, Clock, type LucideIcon } from 'lucide-react'

type IconComponent = typeof Package

/**
 * Mapea estado de API a texto legible en español
 * @param status - Estado del lote desde la API
 * @returns Texto legible del estado
 * @example
 * getBatchStatusText('EN_PRODUCCION') // 'En Producción'
 */
export function getBatchStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'PENDIENTE': 'Pendiente',
    'EN_PRODUCCION': 'En Producción',
    'EN_ESPERA': 'En Espera',
    'COMPLETADO': 'Completado',
    'COMPLETO': 'Completado',
    'CANCELADO': 'Cancelado'
  }
  return statusMap[status] || status
}

/**
 * Obtiene el icono correspondiente a un estado de lote
 * @param status - Estado del lote
 * @returns Componente de icono de Lucide
 * @example
 * const Icon = getBatchStatusIcon('EN_PRODUCCION')
 * <Icon className="w-4 h-4" />
 */
export function getBatchStatusIcon(status: string): IconComponent {
  const iconMap: Record<string, IconComponent> = {
    'PENDIENTE': Clock,
    'EN_PRODUCCION': Play,
    'EN_ESPERA': Pause,
    'COMPLETADO': CheckCircle,
    'COMPLETO': CheckCircle,
    'CANCELADO': XCircle
  }
  return iconMap[status] || Package
}

/**
 * Obtiene la configuración de colores para un estado de lote
 * @param status - Estado del lote
 * @returns Objeto con clases CSS para bg, text y border
 * @example
 * const config = getBatchStatusColor('EN_PRODUCCION')
 * // { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' }
 */
export function getBatchStatusColor(status: string) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    'PENDIENTE': {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300'
    },
    'EN_PRODUCCION': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300'
    },
    'EN_ESPERA': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300'
    },
    'COMPLETADO': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300'
    },
    'COMPLETO': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300'
    },
    'CANCELADO': {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300'
    }
  }
  return colorMap[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    border: 'border-gray-300'
  }
}

/**
 * Obtiene la configuración completa de badge para un estado
 * @param status - Estado del lote
 * @returns Objeto con className, label e icon
 * @example
 * const config = getBatchStatusBadgeConfig('EN_PRODUCCION')
 * // { className: 'bg-blue-100...', label: 'En Producción', icon: Play }
 */
export function getBatchStatusBadgeConfig(status: string) {
  const colors = getBatchStatusColor(status)
  return {
    className: `${colors.bg} ${colors.text} border ${colors.border}`,
    label: getBatchStatusText(status),
    icon: getBatchStatusIcon(status)
  }
}

/**
 * Formatea una fecha ISO a formato legible en español
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada o "No definida" si es inválida
 * @example
 * formatBatchDate('2025-11-22T10:30:00') // '22 nov 2025, 10:30'
 */
export function formatBatchDate(dateString: string | null | undefined): string {
  if (!dateString) return 'No definida'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha inválida'
    
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Fecha inválida'
  }
}

/**
 * Formatea solo la fecha sin hora
 * @param dateString - Fecha en formato ISO string
 * @returns Fecha formateada o "No definida" si es inválida
 * @example
 * formatBatchDateOnly('2025-11-22T10:30:00') // '22 nov 2025'
 */
export function formatBatchDateOnly(dateString: string | null | undefined): string {
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
 * Formatea la cantidad del lote con unidad
 * @param quantity - Cantidad numérica
 * @param unit - Unidad de medida (opcional)
 * @returns String formateado
 * @example
 * formatBatchQuantity(500, 'LT') // '500 L'
 */
export function formatBatchQuantity(quantity: number, unit?: string): string {
  const unitLabels: Record<string, string> = {
    'KG': 'kg',
    'LT': 'L',
    'UNIDAD': 'unidades'
  }
  
  const formattedQuantity = quantity.toLocaleString('es-ES')
  return unit ? `${formattedQuantity} ${unitLabels[unit] || unit}` : formattedQuantity
}

/**
 * Calcula la duración de un lote en horas
 * @param startDate - Fecha de inicio
 * @param endDate - Fecha de fin (si está completado)
 * @returns Duración en horas o null si no está completado
 * @example
 * calculateBatchDuration('2025-11-22T08:00:00', '2025-11-22T16:00:00') // 8
 */
export function calculateBatchDuration(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): number | null {
  if (!startDate || !endDate) return null
  
  try {
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    const durationMs = end - start
    return Math.round(durationMs / (1000 * 60 * 60)) // Convertir a horas
  } catch {
    return null
  }
}

/**
 * Formatea la duración en formato legible
 * @param hours - Duración en horas
 * @returns String formateado
 * @example
 * formatDuration(25) // '1d 1h'
 */
export function formatDuration(hours: number | null): string {
  if (hours === null) return 'N/A'
  
  if (hours < 24) {
    return `${hours}h`
  }
  
  const days = Math.floor(hours / 24)
  const remainingHours = hours % 24
  return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`
}

/**
 * Calcula el progreso del lote basado en fases completadas
 * NOTA: Esta función retorna 0 ya que BatchResponse no incluye phases
 * Se puede extender cuando se obtenga el detalle completo del lote
 * @param batch - Datos del lote
 * @returns Porcentaje de progreso (0-100)
 * @example
 * calculateBatchProgress(batch) // 0 (sin datos de fases)
 */
export function calculateBatchProgress(batch: BatchResponse): number {
  // BatchResponse no incluye phases, retornamos 0
  // Esta función se puede usar con un tipo extendido que incluya phases
  return 0
}

/**
 * Valida si los datos de un lote son válidos
 * @param batch - Lote a validar
 * @returns true si el lote tiene datos válidos
 * @example
 * validateBatchData(batch) // true si tiene campos requeridos
 */
export function validateBatchData(batch: BatchResponse): boolean {
  return !!(
    batch.id &&
    batch.code &&
    batch.quantity > 0 &&
    batch.status &&
    batch.orderId
  )
}

/**
 * Filtra lotes por estado
 * @param batches - Array de lotes
 * @param status - Estado a filtrar
 * @returns Array filtrado de lotes
 * @example
 * filterBatchesByStatus(batches, 'EN_PRODUCCION')
 */
export function filterBatchesByStatus(
  batches: BatchResponse[],
  status: string
): BatchResponse[] {
  return batches.filter(batch => batch.status === status)
}

/**
 * Calcula estadísticas de lotes
 * @param batches - Array de lotes
 * @returns Objeto con contadores por estado y totales
 * @example
 * const stats = calculateBatchStats(batches)
 * // { total: 10, pendientes: 2, enProduccion: 3, ... }
 */
export function calculateBatchStats(batches: BatchResponse[]) {
  return {
    total: batches.length,
    pendientes: filterBatchesByStatus(batches, 'PENDIENTE').length,
    enProduccion: filterBatchesByStatus(batches, 'EN_PRODUCCION').length,
    enEspera: filterBatchesByStatus(batches, 'EN_ESPERA').length,
    completados: filterBatchesByStatus(batches, 'COMPLETADO').length + 
                 filterBatchesByStatus(batches, 'COMPLETO').length,
    cancelados: filterBatchesByStatus(batches, 'CANCELADO').length,
    volumenTotal: batches.reduce((sum, batch) => sum + batch.quantity, 0)
  }
}

/**
 * Ordena lotes por fecha de inicio (más reciente primero)
 * @param batches - Array de lotes
 * @returns Array ordenado de lotes
 * @example
 * sortBatchesByDate(batches)
 */
export function sortBatchesByStartDate(
  batches: BatchResponse[]
): BatchResponse[] {
  return [...batches].sort((a, b) => {
    const dateA = new Date(a.startDate || 0).getTime()
    const dateB = new Date(b.startDate || 0).getTime()
    return dateB - dateA // Más reciente primero
  })
}

/**
 * Ordena lotes por código de lote
 * @param batches - Array de lotes
 * @returns Array ordenado de lotes
 * @example
 * sortBatchesByCode(batches)
 */
export function sortBatchesByCode(
  batches: BatchResponse[]
): BatchResponse[] {
  return [...batches].sort((a, b) => 
    a.code.localeCompare(b.code, 'es')
  )
}

/**
 * Verifica si un lote puede ser cancelado
 * @param batch - Lote a verificar
 * @returns true si puede ser cancelado
 * @example
 * canCancelBatch(batch) // false si está completado o cancelado
 */
export function canCancelBatch(batch: BatchResponse): boolean {
  return batch.status !== 'COMPLETADO' && 
         batch.status !== 'CANCELADO'
}

/**
 * Verifica si un lote está activo (en producción o en espera)
 * @param batch - Lote a verificar
 * @returns true si está activo
 * @example
 * isBatchActive(batch) // true si está en producción o espera
 */
export function isBatchActive(batch: BatchResponse): boolean {
  return batch.status === 'EN_PRODUCCION' || batch.status === 'EN_ESPERA'
}

/**
 * Verifica si un lote está completado
 * @param batch - Lote a verificar
 * @returns true si está completado
 * @example
 * isBatchCompleted(batch) // true si terminó
 */
export function isBatchCompleted(batch: BatchResponse): boolean {
  return batch.status === 'COMPLETADO'
}

/**
 * Obtiene un resumen del lote
 * @param batch - Lote
 * @returns String con resumen
 * @example
 * getBatchSummary(batch) // 'LOTE-001 - IPA Americana - 500 L - En Producción'
 */
export function getBatchSummary(batch: BatchResponse): string {
  const parts = [
    batch.code,
    batch.productName || 'Producto',
    formatBatchQuantity(batch.quantity),
    getBatchStatusText(batch.status)
  ]
  return parts.join(' - ')
}

/**
 * Busca lotes por código (búsqueda parcial, case-insensitive)
 * @param batches - Array de lotes
 * @param searchTerm - Término de búsqueda
 * @returns Array filtrado de lotes
 * @example
 * searchBatchesByCode(batches, 'LOTE-001')
 */
export function searchBatchesByCode(
  batches: BatchResponse[],
  searchTerm: string
): BatchResponse[] {
  const term = searchTerm.toLowerCase().trim()
  if (!term) return batches
  
  return batches.filter(batch => 
    batch.code.toLowerCase().includes(term)
  )
}

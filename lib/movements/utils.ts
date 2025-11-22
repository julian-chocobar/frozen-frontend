/**
 * Utilidades compartidas para el módulo de movimientos
 * Funciones reutilizables para formateo, validación y transformación de datos
 */

import type { MovementResponse, MovementDetailResponse, MovementType, MovementStatus } from '@/types'
import { ArrowUp, ArrowDown, Lock, RotateCcw } from 'lucide-react'

/**
 * Formatea el ID de un movimiento con prefijo
 * 
 * @example
 * ```typescript
 * formatMovementId('123') // => '#123'
 * ```
 */
export function formatMovementId(id: string | number): string {
  return `#${id}`
}

/**
 * Obtiene el icono correspondiente para un tipo de movimiento
 * 
 * @param type - Tipo de movimiento
 * @returns Componente de icono de Lucide
 * 
 * @example
 * ```typescript
 * const Icon = getMovementIcon('INGRESO')
 * <Icon className="w-4 h-4" />
 * ```
 */
export function getMovementIcon(type: MovementType) {
  const icons = {
    INGRESO: ArrowUp,
    EGRESO: ArrowDown,
    RESERVA: Lock,
    DEVUELTO: RotateCcw,
  }
  return icons[type] || ArrowUp
}

/**
 * Obtiene las clases de color para un tipo de movimiento
 * 
 * @param type - Tipo de movimiento
 * @returns Objeto con clases CSS para icono y texto
 * 
 * @example
 * ```typescript
 * const colors = getMovementTypeColors('INGRESO')
 * // => { icon: 'text-green-600', text: 'text-green-800', bg: 'bg-green-100' }
 * ```
 */
export function getMovementTypeColors(type: MovementType) {
  const colors = {
    INGRESO: {
      icon: 'text-green-600',
      text: 'text-green-800',
      bg: 'bg-green-100',
      border: 'border-green-300',
    },
    EGRESO: {
      icon: 'text-red-600',
      text: 'text-red-800',
      bg: 'bg-red-100',
      border: 'border-red-300',
    },
    RESERVA: {
      icon: 'text-orange-600',
      text: 'text-orange-800',
      bg: 'bg-orange-100',
      border: 'border-orange-300',
    },
    DEVUELTO: {
      icon: 'text-purple-600',
      text: 'text-purple-800',
      bg: 'bg-purple-100',
      border: 'border-purple-300',
    },
  }
  return colors[type] || colors.INGRESO
}

/**
 * Obtiene las clases de color para un estado de movimiento
 * 
 * @param status - Estado del movimiento
 * @returns Objeto con clases CSS para el badge de estado
 * 
 * @example
 * ```typescript
 * const colors = getMovementStatusColors('PENDIENTE')
 * // => { bg: 'bg-yellow-100', text: 'text-yellow-800' }
 * ```
 */
export function getMovementStatusColors(status: MovementStatus) {
  const colors = {
    PENDIENTE: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-300',
    },
    EN_PROCESO: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
    COMPLETADO: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-300',
    },
  }
  return colors[status] || colors.PENDIENTE
}

/**
 * Formatea una fecha en formato legible
 * 
 * @param date - Fecha en formato ISO o Date
 * @param includeTime - Si debe incluir la hora
 * @returns Fecha formateada
 * 
 * @example
 * ```typescript
 * formatMovementDate('2024-11-22T10:30:00Z') // => '22/11/2024'
 * formatMovementDate('2024-11-22T10:30:00Z', true) // => '22/11/2024 10:30'
 * ```
 */
export function formatMovementDate(date: string | Date, includeTime: boolean = false): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
  
  if (includeTime) {
    options.hour = '2-digit'
    options.minute = '2-digit'
  }
  
  return dateObj.toLocaleDateString('es-ES', options)
}

/**
 * Calcula la cantidad total de un movimiento
 * Para movimientos simples, retorna el stock
 * Para movimientos con detalles, suma las cantidades de los items
 * 
 * @param movement - Movimiento o detalle de movimiento
 * @returns Cantidad total
 * 
 * @example
 * ```typescript
 * calculateTotalQuantity(movement) // => 150.5
 * ```
 */
export function calculateTotalQuantity(
  movement: MovementResponse | MovementDetailResponse
): number {
  if ('items' in movement && movement.items && Array.isArray(movement.items)) {
    return movement.items.reduce((total, item) => total + (item.quantity || 0), 0)
  }
  return movement.stock || 0
}

/**
 * Valida si un movimiento puede cambiar a estado "En Proceso"
 * Solo movimientos PENDIENTE pueden pasar a EN_PROCESO
 * 
 * @param movement - Movimiento a validar
 * @returns true si puede cambiar a "En Proceso"
 */
export function canToggleInProgress(movement: MovementResponse | MovementDetailResponse): boolean {
  return movement.status === 'PENDIENTE' || movement.status === 'EN_PROCESO'
}

/**
 * Valida si un movimiento puede ser completado
 * Solo movimientos PENDIENTE o EN_PROCESO pueden ser completados
 * 
 * @param movement - Movimiento a validar
 * @returns true si puede ser completado
 */
export function canCompleteMovement(movement: MovementResponse | MovementDetailResponse): boolean {
  return movement.status === 'PENDIENTE' || movement.status === 'EN_PROCESO'
}

/**
 * Obtiene el texto descriptivo de una acción según el estado actual
 * 
 * @param status - Estado actual del movimiento
 * @returns Texto para el botón de acción
 * 
 * @example
 * ```typescript
 * getActionText('PENDIENTE') // => 'Iniciar Proceso'
 * getActionText('EN_PROCESO') // => 'Revertir a Pendiente'
 * ```
 */
export function getActionText(status: MovementStatus): string {
  const texts = {
    PENDIENTE: 'Iniciar Proceso',
    EN_PROCESO: 'Revertir a Pendiente',
    COMPLETADO: 'Completado',
  }
  return texts[status] || ''
}

/**
 * Ordena movimientos por múltiples criterios
 * 
 * @param movements - Array de movimientos
 * @param sortBy - Campo por el cual ordenar
 * @param order - Orden ascendente o descendente
 * @returns Array ordenado de movimientos
 * 
 * @example
 * ```typescript
 * sortMovements(movements, 'creationDate', 'desc')
 * ```
 */
export function sortMovements(
  movements: MovementResponse[],
  sortBy: keyof MovementResponse,
  order: 'asc' | 'desc' = 'desc'
): MovementResponse[] {
  return [...movements].sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]

    if (aValue === bValue) return 0

    // Handle undefined values
    if (aValue === undefined && bValue === undefined) return 0
    if (aValue === undefined) return 1
    if (bValue === undefined) return -1

    const comparison = aValue < bValue ? -1 : 1
    return order === 'asc' ? comparison : -comparison
  })
}

/**
 * Filtra movimientos según múltiples criterios
 * 
 * @param movements - Array de movimientos
 * @param filters - Objeto con filtros a aplicar
 * @returns Array filtrado de movimientos
 * 
 * @example
 * ```typescript
 * filterMovements(movements, { 
 *   type: 'INGRESO', 
 *   status: 'PENDIENTE',
 *   materialId: '123'
 * })
 * ```
 */
export function filterMovements(
  movements: MovementResponse[],
  filters: {
    type?: MovementType | 'Todas'
    status?: MovementStatus | 'Todos'
    materialId?: string
    dateFrom?: string
    dateTo?: string
  }
): MovementResponse[] {
  return movements.filter(movement => {
    // Filtro por tipo
    if (filters.type && filters.type !== 'Todas' && movement.type !== filters.type) {
      return false
    }

    // Filtro por estado
    if (filters.status && filters.status !== 'Todos' && movement.status !== filters.status) {
      return false
    }

    // Filtro por material (el filtro se aplica a nivel de API, aquí solo lo mantenemos compatible)
    // MovementResponse no tiene materialId, el filtrado se hace en el backend
    if (filters.materialId) {
      // Este filtro se pasa al backend, aquí no hacemos nada
    }

    // Filtro por fecha desde
    if (filters.dateFrom) {
      const movementDate = new Date(movement.creationDate)
      const fromDate = new Date(filters.dateFrom)
      if (movementDate < fromDate) {
        return false
      }
    }

    // Filtro por fecha hasta
    if (filters.dateTo) {
      const movementDate = new Date(movement.creationDate)
      const toDate = new Date(filters.dateTo)
      toDate.setHours(23, 59, 59, 999) // Incluir todo el día
      if (movementDate > toDate) {
        return false
      }
    }

    return true
  })
}

/**
 * Obtiene un resumen de estadísticas de movimientos
 * 
 * @param movements - Array de movimientos
 * @returns Objeto con estadísticas agregadas
 * 
 * @example
 * ```typescript
 * getMovementsStats(movements)
 * // => { 
 * //   total: 150, 
 * //   pending: 20, 
 * //   inProgress: 10,
 * //   completed: 120,
 * //   byType: { INGRESO: 80, EGRESO: 50, ... }
 * // }
 * ```
 */
export function getMovementsStats(movements: MovementResponse[]) {
  return movements.reduce((stats, movement) => {
    stats.total++
    
    // Por estado
    if (movement.status === 'PENDIENTE') stats.pending++
    if (movement.status === 'EN_PROCESO') stats.inProgress++
    if (movement.status === 'COMPLETADO') stats.completed++
    
    // Por tipo
    stats.byType[movement.type] = (stats.byType[movement.type] || 0) + 1
    
    // Cantidad total (stock)
    stats.totalQuantity += movement.stock || 0
    
    return stats
  }, {
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    byType: {} as Record<MovementType, number>,
    totalQuantity: 0,
  })
}

/**
 * Valida los datos de un movimiento antes de crear
 * 
 * @param movement - Datos del movimiento a validar
 * @returns Objeto con validez y errores
 * 
 * @example
 * ```typescript
 * validateMovementData({ type: 'INGRESO', stock: -5 })
 * // => { valid: false, errors: { stock: 'El stock debe ser positivo' } }
 * ```
 */
export function validateMovementData(movement: Partial<MovementResponse>): {
  valid: boolean
  errors: Record<string, string>
} {
  const errors: Record<string, string> = {}

  if (!movement.type) {
    errors.type = 'El tipo de movimiento es requerido'
  }

  if (!movement.materialName || movement.materialName.trim() === '') {
    errors.materialName = 'El nombre del material es requerido'
  }

  if (movement.stock === undefined || movement.stock === null) {
    errors.stock = 'La cantidad es requerida'
  } else if (movement.stock <= 0) {
    errors.stock = 'La cantidad debe ser mayor a 0'
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  }
}

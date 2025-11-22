/**
 * Utilidades para el módulo de órdenes de producción
 * Contiene funciones reutilizables para formateo, validación y transformación de datos
 */

import type { ProductionOrderStatus, ProductionOrderResponse } from '@/types'
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Ban, 
  type LucideIcon 
} from 'lucide-react'

/**
 * Obtiene la configuración de estilo para un estado de orden
 * @param status - Estado de la orden de producción
 * @returns Objeto con configuración de icono, etiqueta y clases CSS
 * @example
 * const config = getOrderStatusConfig('PENDIENTE')
 * // { icon: Clock, label: 'Pendiente', variant: 'warning', className: '...' }
 */
export function getOrderStatusConfig(status: ProductionOrderStatus) {
  const configs: Record<ProductionOrderStatus, {
    icon: LucideIcon
    label: string
    variant: 'default' | 'warning' | 'success' | 'destructive' | 'outline'
    className: string
  }> = {
    PENDIENTE: {
      icon: Clock,
      label: 'Pendiente',
      variant: 'warning',
      className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
    },
    APROBADA: {
      icon: CheckCircle,
      label: 'Aprobada',
      variant: 'success',
      className: 'bg-green-100 text-green-800 border-green-300'
    },
    RECHAZADA: {
      icon: XCircle,
      label: 'Rechazada',
      variant: 'destructive',
      className: 'bg-red-100 text-red-800 border-red-300'
    },
    CANCELADA: {
      icon: Ban,
      label: 'Cancelada',
      variant: 'outline',
      className: 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  return configs[status] || configs.PENDIENTE
}

/**
 * Obtiene el texto descriptivo para un estado de orden
 * @param status - Estado de la orden de producción
 * @returns Texto del estado en español
 * @example
 * getOrderStatusText('PENDIENTE') // 'Pendiente'
 */
export function getOrderStatusText(status: ProductionOrderStatus): string {
  return getOrderStatusConfig(status).label
}

/**
 * Obtiene el icono correspondiente a un estado de orden
 * @param status - Estado de la orden de producción
 * @returns Componente de icono de Lucide
 * @example
 * const Icon = getOrderStatusIcon('APROBADA')
 * <Icon className="w-4 h-4" />
 */
export function getOrderStatusIcon(status: ProductionOrderStatus): LucideIcon {
  return getOrderStatusConfig(status).icon
}

/**
 * Obtiene la clase CSS para el color de un estado de orden
 * @param status - Estado de la orden de producción
 * @returns String con clases CSS de Tailwind
 * @example
 * getOrderStatusColor('APROBADA') // 'bg-green-100 text-green-800 border-green-300'
 */
export function getOrderStatusColor(status: ProductionOrderStatus): string {
  return getOrderStatusConfig(status).className
}

/**
 * Formatea una fecha ISO a formato legible en español
 * @param dateString - Fecha en formato ISO string
 * @param includeTime - Si se debe incluir la hora (default: false)
 * @returns Fecha formateada o "No definida" si es inválida
 * @example
 * formatOrderDate('2025-11-22T10:30:00') // '22 nov 2025'
 * formatOrderDate('2025-11-22T10:30:00', true) // '22 nov 2025, 10:30'
 */
export function formatOrderDate(dateString: string | null | undefined, includeTime = false): string {
  if (!dateString) return 'No definida'
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Fecha inválida'
    
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }
    
    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    
    return date.toLocaleDateString('es-ES', options)
  } catch {
    return 'Fecha inválida'
  }
}

/**
 * Formatea la cantidad con su unidad de medida
 * @param quantity - Cantidad numérica
 * @param unit - Unidad de medida
 * @returns String formateado con cantidad y unidad
 * @example
 * formatOrderQuantity(500, 'LT') // '500 L'
 * formatOrderQuantity(25, 'KG') // '25 kg'
 */
export function formatOrderQuantity(quantity: number, unit: string): string {
  const unitLabels: Record<string, string> = {
    'KG': 'kg',
    'LT': 'L',
    'UNIDAD': 'unidades'
  }
  
  return `${quantity.toLocaleString('es-ES')} ${unitLabels[unit] || unit}`
}

/**
 * Valida si una orden puede ser aprobada
 * @param order - Orden de producción
 * @returns true si la orden puede ser aprobada
 * @example
 * canApproveOrder(order) // true si está PENDIENTE
 */
export function canApproveOrder(order: ProductionOrderResponse): boolean {
  return order.status === 'PENDIENTE'
}

/**
 * Valida si una orden puede ser rechazada
 * @param order - Orden de producción
 * @returns true si la orden puede ser rechazada
 * @example
 * canRejectOrder(order) // true si está PENDIENTE
 */
export function canRejectOrder(order: ProductionOrderResponse): boolean {
  return order.status === 'PENDIENTE'
}

/**
 * Valida si una orden puede ser cancelada
 * @param order - Orden de producción
 * @returns true si la orden puede ser cancelada
 * @example
 * canCancelOrder(order) // true si está PENDIENTE o APROBADA
 */
export function canCancelOrder(order: ProductionOrderResponse): boolean {
  return order.status === 'PENDIENTE' || order.status === 'APROBADA'
}

/**
 * Filtra órdenes por estado
 * @param orders - Array de órdenes
 * @param status - Estado a filtrar
 * @returns Array filtrado de órdenes
 * @example
 * filterOrdersByStatus(orders, 'PENDIENTE')
 */
export function filterOrdersByStatus(
  orders: ProductionOrderResponse[],
  status: ProductionOrderStatus
): ProductionOrderResponse[] {
  return orders.filter(order => order.status === status)
}

/**
 * Calcula estadísticas de órdenes
 * @param orders - Array de órdenes
 * @returns Objeto con contadores por estado y total de cantidad
 * @example
 * const stats = calculateOrderStats(orders)
 * // { total: 10, pending: 3, approved: 5, rejected: 1, cancelled: 1, totalQuantity: 5000 }
 */
export function calculateOrderStats(orders: ProductionOrderResponse[]) {
  return {
    total: orders.length,
    pending: filterOrdersByStatus(orders, 'PENDIENTE').length,
    approved: filterOrdersByStatus(orders, 'APROBADA').length,
    rejected: filterOrdersByStatus(orders, 'RECHAZADA').length,
    cancelled: filterOrdersByStatus(orders, 'CANCELADA').length,
    totalQuantity: orders.reduce((sum, order) => sum + order.quantity, 0)
  }
}

/**
 * Ordena órdenes por fecha de planificación (más reciente primero)
 * @param orders - Array de órdenes
 * @returns Array ordenado de órdenes
 * @example
 * sortOrdersByPlannedDate(orders)
 */
export function sortOrdersByPlannedDate(
  orders: ProductionOrderResponse[]
): ProductionOrderResponse[] {
  return [...orders].sort((a, b) => {
    const dateA = new Date(a.plannedDate).getTime()
    const dateB = new Date(b.plannedDate).getTime()
    return dateB - dateA // Más reciente primero
  })
}

/**
 * Valida si los datos de una orden son válidos
 * @param order - Orden de producción
 * @returns true si la orden tiene datos válidos
 * @example
 * validateOrderData(order) // true si tiene campos requeridos
 */
export function validateOrderData(order: ProductionOrderResponse): boolean {
  return !!(
    order.id &&
    order.productName &&
    order.packagingName &&
    order.quantity > 0 &&
    order.plannedDate &&
    order.status
  )
}

/**
 * Obtiene el color de prioridad basado en la fecha planificada
 * @param plannedDate - Fecha planificada en formato ISO
 * @returns String con clase de color CSS
 * @example
 * getOrderPriorityColor('2025-11-22') // 'text-red-600' si es urgente
 */
export function getOrderPriorityColor(plannedDate: string): string {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const planned = new Date(plannedDate)
  planned.setHours(0, 0, 0, 0)
  
  const diffDays = Math.ceil((planned.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600' // Vencida
  if (diffDays <= 3) return 'text-orange-600' // Próxima (3 días o menos)
  if (diffDays <= 7) return 'text-yellow-600' // Media (7 días o menos)
  return 'text-green-600' // Futura
}

/**
 * Verifica si una orden está vencida
 * @param plannedDate - Fecha planificada en formato ISO
 * @returns true si la fecha ya pasó
 * @example
 * isOrderOverdue('2025-11-20') // true si hoy es después del 20
 */
export function isOrderOverdue(plannedDate: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const planned = new Date(plannedDate)
  planned.setHours(0, 0, 0, 0)
  
  return planned < today
}

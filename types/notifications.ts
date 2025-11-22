/**
 * Tipos relacionados con notificaciones
 */

// ============================================
// NOTIFICACIONES
// ============================================

export type NotificationType = 
  | "PRODUCTION_ORDER_PENDING"   // Nueva orden de producción pendiente (→ GERENTE_DE_PLANTA)
  | "PRODUCTION_ORDER_APPROVED"  // Orden de producción aprobada
  | "PRODUCTION_ORDER_REJECTED"  // Orden de producción rechazada
  | "SYSTEM_REMINDER"            // Recordatorio del sistema
  | "PENDING_MOVEMENT"           // Movimiento pendiente (→ OPERARIO_DE_ALMACEN)
  | "LOW_STOCK_ALERT"            // Alerta de stock bajo (→ SUPERVISOR_DE_ALMACEN)

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  message: string
  relatedEntityId?: number
  isRead: boolean
  createdAt: string  // ISO date string
  readAt?: string    // ISO date string
}

export interface NotificationResponseDTO {
  id: number
  type: NotificationType
  message: string
  relatedEntityId?: number
  isRead: boolean
  createdAt: string
  readAt?: string
}

export interface NotificationStats {
  unreadCount: number
  totalCount: number
}

export interface NotificationsPageResponse {
  notifications: NotificationResponseDTO[]
  content: NotificationResponseDTO[]
  currentPage: number
  totalItems: number
  totalPages: number
  size: number
  isFirst: boolean
  isLast: boolean
  hasNext: boolean
  hasPrevious: boolean
}

export interface NotificationFilters {
  page?: number
  size?: number
  unreadOnly?: boolean
}

export interface ConnectionsInfo {
  activeConnections: number
  totalSystemConnections: number
}

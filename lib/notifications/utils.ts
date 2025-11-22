/**
 * Utilidades para notificaciones
 * Funciones reutilizables para formateo, validación y operaciones con notificaciones
 */

import type { LucideIcon } from 'lucide-react';
import {
  Bell,
  AlertTriangle,
  Package,
  ClipboardList,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { NotificationResponseDTO, NotificationType } from '@/types';

/**
 * Obtener el ícono correspondiente al tipo de notificación
 * 
 * @param type - Tipo de notificación
 * @returns Componente de ícono de Lucide React
 * 
 * @example
 * ```tsx
 * const Icon = getNotificationIcon('LOW_STOCK_ALERT');
 * <Icon className="w-4 h-4" />
 * ```
 */
export function getNotificationIcon(type: NotificationType): LucideIcon {
  const iconMap: Record<NotificationType, LucideIcon> = {
    PRODUCTION_ORDER_PENDING: ClipboardList,
    PRODUCTION_ORDER_APPROVED: CheckCircle,
    PRODUCTION_ORDER_REJECTED: XCircle,
    PENDING_MOVEMENT: Package,
    LOW_STOCK_ALERT: AlertCircle,
    SYSTEM_REMINDER: Bell,
  };

  return iconMap[type] || Bell;
}

/**
 * Obtener las clases de color para el tipo de notificación
 * 
 * @param type - Tipo de notificación
 * @returns String con clases Tailwind para background, border y color
 * 
 * @example
 * ```tsx
 * const colorClass = getNotificationColor('LOW_STOCK_ALERT');
 * // returns "bg-amber-50 border-amber-200 text-amber-600"
 * ```
 */
export function getNotificationColor(type: NotificationType): string {
  const colorMap: Record<NotificationType, string> = {
    PRODUCTION_ORDER_PENDING: 'bg-primary-50 border-primary-200 text-primary-700',
    PRODUCTION_ORDER_APPROVED: 'bg-green-50 border-green-200 text-green-600',
    PRODUCTION_ORDER_REJECTED: 'bg-red-50 border-red-200 text-red-600',
    PENDING_MOVEMENT: 'bg-blue-50 border-blue-200 text-blue-600',
    LOW_STOCK_ALERT: 'bg-amber-50 border-amber-200 text-amber-600',
    SYSTEM_REMINDER: 'bg-gray-50 border-gray-200 text-gray-600',
  };

  return colorMap[type] || 'bg-gray-50 border-gray-200 text-gray-600';
}

/**
 * Obtener el texto legible del tipo de notificación
 * 
 * @param type - Tipo de notificación
 * @returns Texto legible en español
 * 
 * @example
 * ```tsx
 * const text = getNotificationTypeText('LOW_STOCK_ALERT');
 * // returns "Alerta de Stock Bajo"
 * ```
 */
export function getNotificationTypeText(type: NotificationType): string {
  const textMap: Record<NotificationType, string> = {
    PRODUCTION_ORDER_PENDING: 'Orden Pendiente',
    PRODUCTION_ORDER_APPROVED: 'Orden Aprobada',
    PRODUCTION_ORDER_REJECTED: 'Orden Rechazada',
    PENDING_MOVEMENT: 'Movimiento Pendiente',
    LOW_STOCK_ALERT: 'Alerta de Stock Bajo',
    SYSTEM_REMINDER: 'Recordatorio del Sistema',
  };

  return textMap[type] || 'Notificación';
}

/**
 * Obtener la URL de acción para una notificación
 * 
 * @param notification - Objeto de notificación
 * @returns URL o undefined si no hay acción asociada
 * 
 * @example
 * ```tsx
 * const url = getNotificationUrl(notification);
 * if (url) {
 *   router.push(url);
 * }
 * ```
 */
export function getNotificationUrl(notification: NotificationResponseDTO): string | undefined {
  const { type, relatedEntityId } = notification;

  if (!relatedEntityId) return undefined;

  const urlMap: Partial<Record<NotificationType, string>> = {
    PRODUCTION_ORDER_PENDING: `/ordenes/${relatedEntityId}`,
    PRODUCTION_ORDER_APPROVED: `/ordenes/${relatedEntityId}`,
    PRODUCTION_ORDER_REJECTED: `/ordenes/${relatedEntityId}`,
    PENDING_MOVEMENT: `/movimientos/${relatedEntityId}`,
    LOW_STOCK_ALERT: `/materiales/${relatedEntityId}`,
  };

  return urlMap[type];
}

/**
 * Formatear fecha de forma relativa (ej: "Hace 5 min")
 * 
 * @param dateString - Fecha en formato ISO string
 * @returns Texto formateado con tiempo relativo
 * 
 * @example
 * ```tsx
 * formatRelativeTime('2024-01-15T10:30:00Z');
 * // returns "Hace 2 h" (si la hora actual es 12:30)
 * ```
 */
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora mismo';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays < 7) return `Hace ${diffDays} días`;

  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: diffDays > 30 ? 'numeric' : undefined,
  });
}

/**
 * Formatear fecha completa con hora
 * 
 * @param dateString - Fecha en formato ISO string
 * @returns Texto formateado con fecha y hora completas
 * 
 * @example
 * ```tsx
 * formatFullDate('2024-01-15T10:30:00Z');
 * // returns "15 de enero de 2024, 10:30"
 * ```
 */
export function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Validar estructura de una notificación
 * 
 * @param notification - Objeto de notificación a validar
 * @returns true si la notificación es válida, false en caso contrario
 * 
 * @example
 * ```tsx
 * const isValid = validateNotificationData(notification);
 * if (!isValid) {
 *   console.error('Notificación inválida');
 * }
 * ```
 */
export function validateNotificationData(notification: any): notification is NotificationResponseDTO {
  return (
    notification &&
    typeof notification === 'object' &&
    typeof notification.id === 'number' &&
    typeof notification.message === 'string' &&
    typeof notification.type === 'string' &&
    typeof notification.isRead === 'boolean' &&
    typeof notification.createdAt === 'string'
  );
}

/**
 * Filtrar notificaciones por estado de lectura
 * 
 * @param notifications - Array de notificaciones
 * @param filter - Tipo de filtro: 'all', 'read' o 'unread'
 * @returns Array filtrado de notificaciones
 * 
 * @example
 * ```tsx
 * const unreadNotifs = filterNotifications(notifications, 'unread');
 * ```
 */
export function filterNotifications(
  notifications: NotificationResponseDTO[],
  filter: 'all' | 'read' | 'unread'
): NotificationResponseDTO[] {
  if (filter === 'all') return notifications;
  if (filter === 'read') return notifications.filter((n) => n.isRead);
  if (filter === 'unread') return notifications.filter((n) => !n.isRead);
  return notifications;
}

/**
 * Ordenar notificaciones por fecha de creación
 * 
 * @param notifications - Array de notificaciones
 * @param order - Orden: 'asc' (más antiguas primero) o 'desc' (más recientes primero)
 * @returns Array ordenado de notificaciones
 * 
 * @example
 * ```tsx
 * const sorted = sortNotifications(notifications, 'desc');
 * ```
 */
export function sortNotifications(
  notifications: NotificationResponseDTO[],
  order: 'asc' | 'desc' = 'desc'
): NotificationResponseDTO[] {
  return [...notifications].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return order === 'desc' ? dateB - dateA : dateA - dateB;
  });
}

/**
 * Agrupar notificaciones por fecha
 * 
 * @param notifications - Array de notificaciones
 * @returns Objeto con notificaciones agrupadas por categoría de fecha
 * 
 * @example
 * ```tsx
 * const grouped = groupNotificationsByDate(notifications);
 * // { today: [...], yesterday: [...], thisWeek: [...], older: [...] }
 * ```
 */
export function groupNotificationsByDate(notifications: NotificationResponseDTO[]): {
  today: NotificationResponseDTO[];
  yesterday: NotificationResponseDTO[];
  thisWeek: NotificationResponseDTO[];
  older: NotificationResponseDTO[];
} {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  return notifications.reduce(
    (groups, notification) => {
      const notifDate = new Date(notification.createdAt);

      if (notifDate >= today) {
        groups.today.push(notification);
      } else if (notifDate >= yesterday) {
        groups.yesterday.push(notification);
      } else if (notifDate >= weekAgo) {
        groups.thisWeek.push(notification);
      } else {
        groups.older.push(notification);
      }

      return groups;
    },
    {
      today: [] as NotificationResponseDTO[],
      yesterday: [] as NotificationResponseDTO[],
      thisWeek: [] as NotificationResponseDTO[],
      older: [] as NotificationResponseDTO[],
    }
  );
}

/**
 * Obtener el conteo de notificaciones por tipo
 * 
 * @param notifications - Array de notificaciones
 * @returns Objeto con conteos por tipo de notificación
 * 
 * @example
 * ```tsx
 * const counts = getNotificationCountsByType(notifications);
 * // { LOW_STOCK: 3, PRODUCTION_COMPLETE: 5, ... }
 * ```
 */
export function getNotificationCountsByType(
  notifications: NotificationResponseDTO[]
): Record<NotificationType, number> {
  return notifications.reduce(
    (counts, notification) => {
      counts[notification.type] = (counts[notification.type] || 0) + 1;
      return counts;
    },
    {} as Record<NotificationType, number>
  );
}

/**
 * Verificar si una notificación es urgente (requiere atención inmediata)
 * 
 * @param notification - Objeto de notificación
 * @returns true si la notificación es urgente
 * 
 * @example
 * ```tsx
 * if (isUrgentNotification(notification)) {
 *   // Mostrar con prioridad alta
 * }
 * ```
 */
export function isUrgentNotification(notification: NotificationResponseDTO): boolean {
  const urgentTypes: NotificationType[] = ['LOW_STOCK_ALERT', 'PRODUCTION_ORDER_REJECTED'];
  return urgentTypes.includes(notification.type);
}

/**
 * Obtener la prioridad de una notificación
 * 
 * @param notification - Objeto de notificación
 * @returns Nivel de prioridad: 'high', 'medium' o 'low'
 * 
 * @example
 * ```tsx
 * const priority = getNotificationPriority(notification);
 * const className = priority === 'high' ? 'border-red-500' : 'border-gray-300';
 * ```
 */
export function getNotificationPriority(notification: NotificationResponseDTO): 'high' | 'medium' | 'low' {
  const priorityMap: Record<NotificationType, 'high' | 'medium' | 'low'> = {
    PRODUCTION_ORDER_REJECTED: 'high',
    LOW_STOCK_ALERT: 'high',
    PRODUCTION_ORDER_PENDING: 'medium',
    PRODUCTION_ORDER_APPROVED: 'medium',
    PENDING_MOVEMENT: 'medium',
    SYSTEM_REMINDER: 'low',
  };

  return priorityMap[notification.type] || 'low';
}

/**
 * Obtener estadísticas de notificaciones
 * 
 * @param notifications - Array de notificaciones
 * @returns Objeto con estadísticas calculadas
 * 
 * @example
 * ```tsx
 * const stats = getNotificationsStats(notifications);
 * // { total: 10, unread: 5, urgent: 2, byType: {...} }
 * ```
 */
export function getNotificationsStats(notifications: NotificationResponseDTO[]) {
  return {
    total: notifications.length,
    unread: notifications.filter((n) => !n.isRead).length,
    read: notifications.filter((n) => n.isRead).length,
    urgent: notifications.filter(isUrgentNotification).length,
    byType: getNotificationCountsByType(notifications),
    highPriority: notifications.filter((n) => getNotificationPriority(n) === 'high').length,
    mediumPriority: notifications.filter((n) => getNotificationPriority(n) === 'medium').length,
    lowPriority: notifications.filter((n) => getNotificationPriority(n) === 'low').length,
  };
}

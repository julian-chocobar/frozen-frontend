// lib/notifications-api.ts

import { api } from './fetcher';
import type {
  NotificationResponseDTO,
  NotificationStats,
  NotificationsPageResponse,
  NotificationFilters,
  ConnectionsInfo,
} from '@/types';

/**
 * API client para notificaciones
 * Implementa todos los endpoints REST según documentación backend
 */
export const notificationsApi = {
  /**
   * Obtener notificaciones del usuario con paginación
   */
  getNotifications: async (params: {
    page?: number
    size?: number
    unreadOnly?: boolean
  } = {}): Promise<NotificationsPageResponse> => {
    const urlParams: Record<string, string> = {}
    if (params.page !== undefined) urlParams.page = params.page.toString()
    if (params.size !== undefined) urlParams.size = params.size.toString()
    if (params.unreadOnly !== undefined) urlParams.unreadOnly = params.unreadOnly.toString()
    return api.get<NotificationsPageResponse>('/api/notifications', urlParams);
  },

  /**
   * Obtener estadísticas de notificaciones
   */
  getStats: async (): Promise<NotificationStats> => {
    return api.get<NotificationStats>('/api/notifications/stats');
  },

  /**
   * Marcar notificación como leída
   */
  markAsRead: async (notificationId: number): Promise<NotificationResponseDTO> => {
    return api.patch<NotificationResponseDTO>(`/api/notifications/${notificationId}/read`);
  },

  /**
   * Marcar todas las notificaciones como leídas
   */
  markAllAsRead: async (): Promise<void> => {
    return api.patch<void>('/api/notifications/read-all');
  },

  /**
   * Obtener información de conexiones SSE
   */
  getConnectionsInfo: async (): Promise<ConnectionsInfo> => {
    return api.get<ConnectionsInfo>('/api/notifications/connections');
  },
};


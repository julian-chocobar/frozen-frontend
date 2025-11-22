'use client';

import { useState, useEffect, useCallback } from 'react';
import { notificationsApi } from '@/lib/notifications';
import type {
  NotificationResponseDTO,
  NotificationStats,
  NotificationsPageResponse,
} from '@/types';

type FilterType = 'all' | 'unread' | 'read';

/**
 * Props para configurar el hook useNotificationsDashboard
 */
interface UseNotificationsDashboardProps {
  /** Página inicial (base 0) */
  initialPage?: number;
  /** Cantidad de notificaciones por página */
  pageSize?: number;
  /** Filtro inicial a aplicar */
  initialFilter?: FilterType;
}

/**
 * Hook especializado para el dashboard de notificaciones
 * 
 * Maneja el estado completo de notificaciones incluyendo paginación, filtros,
 * estadísticas y acciones como marcar como leída. Proporciona una interfaz
 * unificada para gestionar todas las operaciones relacionadas con notificaciones.
 * 
 * @param props - Configuración del hook
 * @returns Objeto con estado, datos y funciones para gestionar notificaciones
 * 
 * @example
 * ```tsx
 * function NotificationsPage() {
 *   const {
 *     notifications,
 *     stats,
 *     isLoading,
 *     markAsRead,
 *     changeFilter,
 *   } = useNotificationsDashboard({ pageSize: 20 });
 * 
 *   return (
 *     <div>
 *       {notifications.map(n => (
 *         <div key={n.id} onClick={() => markAsRead(n.id)}>
 *           {n.message}
 *         </div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export function useNotificationsDashboard({
  initialPage = 0,
  pageSize = 20,
  initialFilter = 'all'
}: UseNotificationsDashboardProps = {}) {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ unreadCount: 0, totalCount: 0 });
  const [filter, setFilter] = useState<FilterType>(initialFilter);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMarkingAsRead, setIsMarkingAsRead] = useState<Set<number>>(new Set());

  /**
   * Cargar notificaciones con filtros y paginación
   * 
   * @param page - Número de página a cargar
   * @param filterType - Tipo de filtro a aplicar
   */
  const loadNotifications = useCallback(async (
    page = currentPage, 
    filterType = filter
  ) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = {
        page,
        size: pageSize,
        unreadOnly: filterType === 'unread'
      };

      const response = await notificationsApi.getNotifications(params);
      
      let filteredNotifications = response.notifications;
      let filteredTotalItems = response.totalItems;
      let filteredTotalPages = response.totalPages;
      
      // Si el filtro es "read", filtrar en el cliente
      if (filterType === 'read') {
        filteredNotifications = response.notifications.filter(n => n.isRead);
        filteredTotalItems = filteredNotifications.length;
        filteredTotalPages = Math.ceil(filteredTotalItems / pageSize);
      }
      
      setNotifications(filteredNotifications);
      setTotalItems(filteredTotalItems);
      setTotalPages(filteredTotalPages);
      setCurrentPage(response.currentPage);
      
      // Cargar estadísticas actualizadas
      const statsResponse = await notificationsApi.getStats();
      setStats(statsResponse);
      
    } catch (err) {
      console.error('Error cargando notificaciones:', err);
      setError('Error al cargar las notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filter, pageSize]);

  /**
   * Cambiar el filtro de notificaciones y resetear la página a la primera
   * 
   * @param newFilter - Tipo de filtro a aplicar ('all', 'unread', 'read')
   */
  const changeFilter = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
    setCurrentPage(0);
    loadNotifications(0, newFilter);
  }, [loadNotifications]);

  /**
   * Cambiar a una página específica manteniendo el filtro actual
   * 
   * @param page - Número de página a cargar (base 0)
   */
  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
    loadNotifications(page, filter);
  }, [loadNotifications, filter]);

  /**
   * Navegar a la página siguiente si existe
   */
  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      changePage(currentPage + 1);
    }
  }, [currentPage, totalPages, changePage]);

  /**
   * Navegar a la página anterior si existe
   */
  const goToPreviousPage = useCallback(() => {
    if (currentPage > 0) {
      changePage(currentPage - 1);
    }
  }, [currentPage, changePage]);

  /**
   * Marcar una notificación específica como leída
   * 
   * Actualiza el estado local y las estadísticas automáticamente.
   * Previene marcados duplicados si ya está en proceso.
   * 
   * @param notificationId - ID de la notificación a marcar como leída
   * @throws Error si falla la operación en el servidor
   */
  const markAsRead = useCallback(async (notificationId: number) => {
    if (isMarkingAsRead.has(notificationId)) return;

    setIsMarkingAsRead(prev => new Set(prev.add(notificationId)));
    
    try {
      const updated = await notificationsApi.markAsRead(notificationId);
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? updated : n)
      );
      
      // Actualizar estadísticas localmente
      setStats(prev => ({
        ...prev,
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }));
      
    } catch (error) {
      console.error('Error marcando como leída:', error);
      setError('Error al marcar la notificación como leída');
      throw error;
    } finally {
      setIsMarkingAsRead(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  }, [isMarkingAsRead]);

  /**
   * Marcar todas las notificaciones como leídas
   * 
   * Actualiza el estado local de todas las notificaciones y resetea
   * el contador de no leídas a 0.
   * 
   * @throws Error si falla la operación en el servidor
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      
      setNotifications(prev =>
        prev.map(n => ({ 
          ...n, 
          isRead: true, 
          readAt: new Date().toISOString() 
        }))
      );

      setStats(prev => ({
        ...prev,
        unreadCount: 0
      }));
      
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
      setError('Error al marcar todas las notificaciones como leídas');
      throw error;
    }
  }, []);

  /**
   * Recargar las notificaciones desde el servidor
   * 
   * Mantiene la página y filtro actuales.
   */
  const refresh = useCallback(() => {
    loadNotifications(currentPage, filter);
  }, [loadNotifications, currentPage, filter]);

  // Cargar datos iniciales
  useEffect(() => {
    loadNotifications(initialPage, initialFilter);
  }, []); // Solo al montar el componente

  // Información de paginación
  const paginationInfo = {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    hasNextPage: currentPage < totalPages - 1,
    hasPreviousPage: currentPage > 0,
    isFirstPage: currentPage === 0,
    isLastPage: currentPage >= totalPages - 1
  };

  // Estadísticas calculadas
  const calculatedStats = {
    ...stats,
    readCount: stats.totalCount - stats.unreadCount,
    unreadCountInPage: notifications.filter(n => !n.isRead).length,
    readCountInPage: notifications.filter(n => n.isRead).length
  };

  return {
    // Datos
    notifications,
    stats: calculatedStats,
    
    // Estado
    isLoading,
    error,
    filter,
    isMarkingAsRead,
    
    // Paginación
    pagination: paginationInfo,
    
    // Acciones
    markAsRead,
    markAllAsRead,
    changeFilter,
    changePage,
    goToNextPage,
    goToPreviousPage,
    refresh,
    
    // Métodos de utilidad
    clearError: () => setError(null),
    isMarkingNotification: (id: number) => isMarkingAsRead.has(id)
  };
}
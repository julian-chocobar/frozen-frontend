'use client';

import { useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useNotificationsDashboard } from '@/hooks/use-notifications-dashboard';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { NotificationsLoadingState } from '@/components/notifications/notifications-loading-state';
import { NotificationsEmptyState } from '@/components/notifications/notifications-empty-state';
import {
  getNotificationIcon,
  getNotificationColor,
  getNotificationTypeText,
  getNotificationUrl,
  formatRelativeTime,
  formatFullDate,
} from '@/lib/notifications/utils';
import {
  NOTIFICATION_FILTERS,
  NOTIFICATION_FILTER_LABELS,
  NOTIFICATION_EMPTY_STATES,
} from '@/lib/constants';
import {
  Bell,
  CheckCheck,
  RefreshCw,
  Clock,
  Check,
  Filter,
  AlertCircle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const {
    notifications,
    stats,
    isLoading,
    error,
    filter,
    pagination,
    markAsRead,
    markAllAsRead,
    changeFilter,
    goToNextPage,
    goToPreviousPage,
    refresh,
    clearError,
    isMarkingNotification
  } = useNotificationsDashboard({
    pageSize: 20
  });

  /**
   * Manejar marcar como leída con manejo de errores
   * Memoizado para evitar re-renderizados innecesarios
   */
  const handleMarkAsRead = useCallback(async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  }, [markAsRead]);

  /**
   * Manejar marcar todas como leídas con manejo de errores
   * Memoizado para evitar re-renderizados innecesarios
   */
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  }, [markAllAsRead]);

  /**
   * Obtener el estado vacío adecuado según el filtro actual
   * Memoizado para evitar cálculos repetidos
   */
  const emptyState = useMemo(() => {
    if (filter === NOTIFICATION_FILTERS.UNREAD) return NOTIFICATION_EMPTY_STATES.UNREAD;
    if (filter === NOTIFICATION_FILTERS.READ) return NOTIFICATION_EMPTY_STATES.READ;
    return NOTIFICATION_EMPTY_STATES.ALL;
  }, [filter]);

  /**
   * Texto de paginación
   * Memoizado para evitar recalcular en cada render
   */
  const paginationText = useMemo(() => {
    return `Mostrando ${notifications.length} de ${pagination.totalItems} notificaciones`;
  }, [notifications.length, pagination.totalItems]);

  return (
    <>
      <Header
        title="Notificaciones"
        subtitle="Gestiona todas tus notificaciones del sistema"
        backButton={{ href: "/" }}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Panel de resumen */}
        <div className="card border-2 border-border p-6 space-y-4" data-tour="notifications-header">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 border border-primary-200 rounded-lg">
                <Bell className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-primary-900">
                  Centro de Notificaciones
                </h2>
                <p className="text-sm text-primary-600">
                  Mantente al día con los eventos del sistema
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {stats.unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Marcar todas como leídas</span>
                </Button>
              )}
              <Button
                variant="outline"
                onClick={refresh}
                disabled={isLoading}
                title="Actualizar notificaciones"
                className="gap-2 border-primary-300 text-primary-600 hover:bg-primary-50"
              >
                <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
                <span>Actualizar</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4" data-tour="notifications-stats">
          <div className="card border-2 border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-50 border border-primary-200 rounded-lg">
                <Bell className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600">Total</p>
                <p className="text-2xl font-bold text-primary-900">{pagination.totalItems}</p>
              </div>
            </div>
          </div>

          <div className="card border-2 border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-50 border border-sky-200 rounded-lg">
                <Clock className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600">No leídas</p>
                <p className="text-2xl font-bold text-primary-900">{stats.unreadCount}</p>
              </div>
            </div>
          </div>

          <div className="card border-2 border-border p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-primary-600">Leídas</p>
                <p className="text-2xl font-bold text-primary-900">{stats.readCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="card border-2 border-border p-4" data-tour="notifications-filters">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">Filtrar:</span>
            <div className="flex bg-primary-50 border border-primary-200 rounded-lg p-1">
              {[
                { key: 'all', label: NOTIFICATION_FILTER_LABELS.all, count: pagination.totalItems },
                { key: 'unread', label: NOTIFICATION_FILTER_LABELS.unread, count: stats.unreadCount },
                { key: 'read', label: NOTIFICATION_FILTER_LABELS.read, count: stats.readCount }
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => changeFilter(item.key as any)}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    filter === item.key
                      ? 'bg-background text-primary-800 shadow-sm'
                      : 'text-primary-600 hover:text-primary-800'
                  )}
                >
                  {item.label} ({item.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mensajes de error */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-800 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Lista de notificaciones */}
        <div className="card border-2 border-border overflow-hidden" data-tour="notifications-list">
          {isLoading ? (
            <NotificationsLoadingState />
          ) : notifications.length === 0 ? (
            <NotificationsEmptyState
              title={emptyState.title}
              description={emptyState.description}
            />
          ) : (
            <div className="divide-y divide-stroke">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                const actionUrl = getNotificationUrl(notification);
                const typeText = getNotificationTypeText(notification.type);
                const isMarkingCurrent = isMarkingNotification(notification.id);

                const NotificationContent = (
                  <div
                    className={cn(
                      'p-6 hover:bg-primary-50/40 transition-colors',
                      !notification.isRead && 'bg-primary-50/30'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn('p-3 rounded-lg border flex-shrink-0', colorClass)}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                                {typeText}
                              </span>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-primary-600 rounded-full" />
                              )}
                            </div>
                            <p
                              className={cn(
                                'text-primary-900 leading-relaxed',
                                !notification.isRead && 'font-semibold'
                              )}
                            >
                              {notification.message}
                            </p>
                          </div>
                          
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              disabled={isMarkingCurrent}
                              className="p-2 hover:bg-primary-50 rounded-lg transition-colors flex-shrink-0 disabled:opacity-50"
                              title="Marcar como leída"
                            >
                              <Check className="w-4 h-4 text-primary-500" />
                            </button>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-primary-600">
                          <span>
                            {formatRelativeTime(notification.createdAt)}
                          </span>
                          <span>
                            {formatFullDate(notification.createdAt)}
                          </span>
                        </div>
                        
                        {notification.readAt && (
                          <div className="text-xs text-primary-500 mt-1">
                            Leída: {formatFullDate(notification.readAt)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );

                if (actionUrl) {
                  return (
                    <Link key={notification.id} href={actionUrl} className="block">
                      {NotificationContent}
                    </Link>
                  );
                }

                return <div key={notification.id}>{NotificationContent}</div>;
              })}
            </div>
          )}

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-4 border-t border-stroke">
              <div className="text-sm text-primary-600">
                {paginationText}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPage}
                  disabled={!pagination.hasPreviousPage}
                  className="border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
                >
                  Anterior
                </Button>
                
                <span className="px-3 py-1.5 text-sm text-primary-600 rounded-md bg-primary-50 border border-primary-200">
                  Página {pagination.currentPage + 1} de {pagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={!pagination.hasNextPage}
                  className="border-primary-300 text-primary-600 hover:bg-primary-50 disabled:opacity-50"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

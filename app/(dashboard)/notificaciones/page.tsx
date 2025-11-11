'use client';

import { Bell, CheckCheck, Filter, Clock, Check, AlertCircle, Package, ClipboardList, RefreshCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { useNotificationsDashboard } from '@/hooks/use-notifications-dashboard';
import type { 
  NotificationResponseDTO, 
  NotificationType
} from '@/types';
import Link from 'next/link';

/**
 * Icono según tipo de notificación
 */
function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case 'PRODUCTION_ORDER_PENDING':
    case 'PRODUCTION_ORDER_APPROVED':
    case 'PRODUCTION_ORDER_REJECTED':
      return ClipboardList;
    case 'PENDING_MOVEMENT':
      return Package;
    case 'LOW_STOCK_ALERT':
      return AlertCircle;
    case 'SYSTEM_REMINDER':
      return Bell;
    default:
      return Bell;
  }
}

/**
 * Color según tipo de notificación
 */
function getNotificationColor(type: NotificationType) {
  switch (type) {
    case 'PRODUCTION_ORDER_PENDING':
      return 'text-primary-700 bg-primary-50 border-primary-200';
    case 'PRODUCTION_ORDER_APPROVED':
      return 'text-green-700 bg-green-50 border-green-200';
    case 'PRODUCTION_ORDER_REJECTED':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'PENDING_MOVEMENT':
      return 'text-sky-700 bg-sky-50 border-sky-200';
    case 'LOW_STOCK_ALERT':
      return 'text-red-700 bg-red-50 border-red-200';
    case 'SYSTEM_REMINDER':
      return 'text-primary-700 bg-primary-50 border-primary-200';
    default:
      return 'text-primary-700 bg-primary-50 border-primary-200';
  }
}

/**
 * Texto descriptivo del tipo de notificación
 */
function getNotificationTypeText(type: NotificationType): string {
  switch (type) {
    case 'PRODUCTION_ORDER_PENDING':
      return 'Orden Pendiente';
    case 'PRODUCTION_ORDER_APPROVED':
      return 'Orden Aprobada';
    case 'PRODUCTION_ORDER_REJECTED':
      return 'Orden Rechazada';
    case 'PENDING_MOVEMENT':
      return 'Movimiento Pendiente';
    case 'LOW_STOCK_ALERT':
      return 'Stock Bajo';
    case 'SYSTEM_REMINDER':
      return 'Recordatorio';
    default:
      return 'Notificación';
  }
}

/**
 * Obtener URL de acción según tipo de notificación
 */
function getNotificationUrl(notification: NotificationResponseDTO): string | null {
  const { type, relatedEntityId } = notification;

  switch (type) {
    case 'PRODUCTION_ORDER_PENDING':
    case 'PRODUCTION_ORDER_APPROVED':
    case 'PRODUCTION_ORDER_REJECTED':
      // Dirigir al modal de detalle de orden para aprobar/rechazar
      return relatedEntityId ? `/ordenes?detail=${relatedEntityId}` : '/ordenes';
    case 'PENDING_MOVEMENT':
      // Dirigir al modal de detalle de movimiento para marcar como en proceso/completo
      return relatedEntityId ? `/movimientos?detail=${relatedEntityId}` : '/movimientos';
    case 'LOW_STOCK_ALERT':
      // Dirigir al modal de detalle de material para ver información de stock
      return relatedEntityId ? `/materiales?detail=${relatedEntityId}` : '/materiales';
    default:
      return null;
  }
}

/**
 * Formatear fecha relativa
 */
function formatRelativeTime(dateString: string): string {
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
    year: diffDays > 30 ? 'numeric' : undefined
  });
}

/**
 * Formatear fecha completa
 */
function formatFullDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

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
    changePage,
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
   */
  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  /**
   * Manejar marcar todas como leídas con manejo de errores
   */
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      // El error ya se maneja en el hook
    }
  };

  return (
    <>
      <Header
        title="Notificaciones"
        subtitle="Gestiona todas tus notificaciones del sistema"
        backButton={{ href: "/" }}
      />

      <div className="p-4 md:p-6 space-y-6">
        {/* Panel de resumen */}
        <div className="card border-2 border-border p-6 space-y-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="card border-2 border-border p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="w-4 h-4 text-primary-500" />
            <span className="text-sm font-medium text-primary-700">Filtrar:</span>
            <div className="flex bg-primary-50 border border-primary-200 rounded-lg p-1">
              {[
                { key: 'all', label: 'Todas', count: pagination.totalItems },
                { key: 'unread', label: 'No leídas', count: stats.unreadCount },
                { key: 'read', label: 'Leídas', count: stats.readCount }
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
        <div className="card border-2 border-border overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-primary-600">Cargando notificaciones...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-4">
              <Bell className="w-16 h-16 text-primary-400 mb-4" />
              <p className="text-lg font-medium text-primary-900 mb-2">
                No hay notificaciones
              </p>
              <p className="text-primary-600">
                {filter === 'unread' 
                  ? 'No tienes notificaciones sin leer' 
                  : filter === 'read'
                  ? 'No tienes notificaciones leídas'
                  : 'Las notificaciones aparecerán aquí'
                }
              </p>
            </div>
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
                Mostrando {notifications.length} de {pagination.totalItems} notificaciones
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
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, AlertCircle, Package, ClipboardList, TrendingDown, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/use-notifications';
import type { NotificationResponseDTO, NotificationType } from '@/types';
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
      return 'text-blue-600 bg-blue-50';
    case 'PRODUCTION_ORDER_APPROVED':
      return 'text-green-600 bg-green-50';
    case 'PRODUCTION_ORDER_REJECTED':
      return 'text-red-600 bg-red-50';
    case 'PENDING_MOVEMENT':
      return 'text-orange-600 bg-orange-50';
    case 'LOW_STOCK_ALERT':
      return 'text-red-600 bg-red-50';
    case 'SYSTEM_REMINDER':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
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
      return relatedEntityId ? `/ordenes?id=${relatedEntityId}` : '/ordenes';
    case 'PENDING_MOVEMENT':
      return relatedEntityId ? `/movimientos?id=${relatedEntityId}` : '/movimientos';
    case 'LOW_STOCK_ALERT':
      return relatedEntityId ? `/materiales?id=${relatedEntityId}` : '/materiales';
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
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const {
    notifications,
    stats,
    isLoading,
    markAsRead,
    markAllAsRead,
    refresh,
  } = useNotifications();

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleNotificationClick = async (notification: NotificationResponseDTO) => {
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.error('Error marcando notificación:', error);
      }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error marcando todas como leídas:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-16">
      <div
        ref={panelRef}
        className={cn(
          'w-full max-w-md bg-background border border-stroke rounded-lg shadow-card',
          'max-h-[calc(100vh-5rem)] flex flex-col'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stroke">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
            {stats.unreadCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
                {stats.unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refresh}
              className="p-1.5 hover:bg-surface-secondary rounded-lg transition-colors"
              aria-label="Actualizar notificaciones"
              title="Actualizar notificaciones"
              disabled={isLoading}
            >
              <RefreshCw className={cn("w-4 h-4 text-foreground", isLoading && "animate-spin")} />
            </button>
            {stats.unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="p-1.5 hover:bg-surface-secondary rounded-lg transition-colors"
                aria-label="Marcar todas como leídas"
                title="Marcar todas como leídas"
              >
                <CheckCheck className="w-4 h-4 text-foreground" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-surface-secondary rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted">Cargando notificaciones...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <Bell className="w-12 h-12 text-muted mb-4" />
              <p className="text-muted font-medium">No hay notificaciones</p>
              <p className="text-sm text-muted mt-1">Las notificaciones aparecerán aquí</p>
            </div>
          ) : (
            <div className="divide-y divide-stroke">
              {notifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                const colorClass = getNotificationColor(notification.type);
                const actionUrl = getNotificationUrl(notification);
                const NotificationContent = (
                  <div
                    className={cn(
                      'p-4 hover:bg-surface-secondary transition-colors cursor-pointer',
                      !notification.isRead && 'bg-primary-50/50'
                    )}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn('p-2 rounded-lg flex-shrink-0', colorClass)}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            'text-sm text-foreground',
                            !notification.isRead && 'font-semibold'
                          )}
                        >
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted mt-1">
                          {formatRelativeTime(notification.createdAt)}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                );

                if (actionUrl) {
                  return (
                    <Link key={notification.id} href={actionUrl} onClick={onClose}>
                      {NotificationContent}
                    </Link>
                  );
                }

                return <div key={notification.id}>{NotificationContent}</div>;
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-stroke">
          <Link
            href="/notificaciones"
            onClick={onClose}
            className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium py-2"
          >
            {notifications.length > 0 ? 'Ver todas las notificaciones' : 'Ir al tablero de notificaciones'}
          </Link>
        </div>
      </div>
    </div>
  );
}


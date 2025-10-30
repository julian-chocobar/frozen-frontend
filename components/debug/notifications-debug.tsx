'use client';

import { useState } from 'react';
import { Bell, RefreshCw, TestTube } from 'lucide-react';
import { useNotifications } from '@/hooks/use-notifications';
import { cn } from '@/lib/utils';

/**
 * Componente de debug para notificaciones
 * Solo visible en modo desarrollo
 */
export function NotificationsDebug() {
  const [isExpanded, setIsExpanded] = useState(false);
  const {
    notifications,
    stats,
    isConnected,
    isLoading,
    error,
    refresh,
  } = useNotifications();

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isExpanded ? (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80 max-h-96 overflow-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm">Notifications Debug</h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {/* Estado de conexión */}
          <div className="mb-3">
            <div className="text-xs">
              <div className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded text-xs',
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              )}>
                {isConnected ? '🟢 Conectado' : '🔴 Desconectado'}
              </div>
              {isLoading && (
                <div className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 ml-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Cargando
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas */}
          <div className="mb-3 text-xs">
            <div><strong>Total:</strong> {stats.totalCount}</div>
            <div><strong>No leídas:</strong> {stats.unreadCount}</div>
            <div><strong>En memoria:</strong> {notifications.length}</div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-3 p-2 bg-red-50 text-red-700 text-xs rounded">
              {error}
            </div>
          )}

          {/* Últimas notificaciones */}
          <div className="mb-3">
            <div className="text-xs font-medium mb-1">Últimas notificaciones:</div>
            <div className="max-h-32 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="text-xs text-gray-500">No hay notificaciones</div>
              ) : (
                notifications.slice(0, 3).map((notification) => (
                  <div key={notification.id} className="text-xs mb-2 p-2 bg-gray-50 rounded">
                    <div className={cn(
                      'font-medium',
                      notification.isRead ? 'text-gray-600' : 'text-black'
                    )}>
                      {notification.message.substring(0, 50)}...
                    </div>
                    <div className="text-gray-500">
                      {notification.type} | {notification.isRead ? 'Leída' : 'No leída'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Acciones */}
          <div className="flex gap-2">
            <button
              onClick={refresh}
              disabled={isLoading}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsExpanded(true)}
          className={cn(
            'p-3 rounded-full shadow-lg border-2',
            isConnected ? 'bg-green-500 border-green-600' : 'bg-red-500 border-red-600'
          )}
          title="Debug de Notificaciones"
        >
          <TestTube className="w-4 h-4 text-white" />
          {stats.unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
              {stats.unreadCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
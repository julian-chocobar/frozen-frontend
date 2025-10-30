'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { notificationsApi } from '@/lib/notifications-api';
import type {
  NotificationResponseDTO,
  NotificationStats,
} from '@/types';

/**
 * Hook para manejar notificaciones con Server-Sent Events (SSE)
 * 
 * Features:
 * - Carga inicial desde API REST
 * - Conexión SSE para notificaciones en tiempo real
 * - Estado de notificaciones y estadísticas
 * - Métodos para marcar como leídas
 * - Reconexión automática
 */
export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponseDTO[]>([]);
  const [stats, setStats] = useState<NotificationStats>({ unreadCount: 0, totalCount: 0 });
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Empezamos con loading mientras cargamos datos iniciales
  const [error, setError] = useState<string | null>(null);
  const [hasLoadedInitially, setHasLoadedInitially] = useState(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 segundos

  /**
   * Construir URL del SSE endpoint
   * EventSource no soporta custom headers, pero funciona con cookies automáticamente
   */
  const getSSEUrl = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    // Para SSE, conectar directamente al backend 
    // porque Next.js proxy no maneja streams de larga duración bien
    const backendUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:8080' 
      : window.location.origin;
    
    return `${backendUrl}/api/notifications/stream`;
  }, []);

  /**
   * Establecer conexión SSE
   */
  const connectSSE = useCallback(() => {
    const url = getSSEUrl();
    if (!url) return;

    // Cerrar conexión existente si hay alguna
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    try {
      // EventSource con configuración explícita para CORS
      const eventSource = new EventSource(url, {
        withCredentials: true
      });

      eventSource.onopen = () => {
        console.log('📡 SSE: Conexión establecida');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;

        // Limpiar timeout de reconexión si existe
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      eventSource.onerror = (event) => {
        console.error('📡 SSE: Error en conexión', event);
        setIsConnected(false);

        // Intentar reconectar si la conexión se cerró inesperadamente
        if (eventSource.readyState === EventSource.CLOSED) {
          if (reconnectAttempts.current < maxReconnectAttempts) {
            reconnectAttempts.current += 1;
            console.log(`📡 SSE: Reintentando conexión (${reconnectAttempts.current}/${maxReconnectAttempts})...`);
            
            reconnectTimeoutRef.current = setTimeout(() => {
              connectSSE();
            }, reconnectDelay);
          } else {
            setError('No se pudo conectar al servidor de notificaciones');
            console.error('📡 SSE: Máximo de intentos de reconexión alcanzado');
          }
        }
      };

      // Escuchar evento de conexión confirmada
      eventSource.addEventListener('connected', (event) => {
        console.log('📡 SSE: Evento connected recibido', event.data);
      });

      // Escuchar notificaciones iniciales (al conectarse)
      eventSource.addEventListener('initial-notifications', (event) => {
        try {
          const initialNotifications: NotificationResponseDTO[] = JSON.parse(event.data);
          console.log('📨 SSE: Notificaciones iniciales recibidas', initialNotifications.length);
          
          // Solo actualizar si tenemos más notificaciones que las actuales
          // para evitar sobrescribir datos más recientes
          setNotifications(prev => {
            if (initialNotifications.length > prev.length) {
              return initialNotifications;
            }
            return prev;
          });
        } catch (error) {
          console.error('📡 SSE: Error parsing initial notifications', error);
        }
      });

      // Escuchar nuevas notificaciones
      eventSource.addEventListener('notification', (event) => {
        try {
          const notification: NotificationResponseDTO = JSON.parse(event.data);
          console.log('📨 SSE: Nueva notificación recibida', notification);
          
          setNotifications((prev) => [notification, ...prev]);
          
          // Actualizar estadísticas
          setStats((prev) => ({
            unreadCount: prev.unreadCount + 1,
            totalCount: prev.totalCount + 1,
          }));
        } catch (error) {
          console.error('📡 SSE: Error parsing notification', error);
        }
      });

      // Escuchar actualizaciones de estadísticas
      eventSource.addEventListener('stats-update', (event) => {
        try {
          const newStats: NotificationStats = JSON.parse(event.data);
          console.log('📊 SSE: Actualización de estadísticas', newStats);
          setStats(newStats);
        } catch (error) {
          console.error('📡 SSE: Error parsing stats', error);
        }
      });

      eventSourceRef.current = eventSource;
    } catch (error) {
      console.error('📡 SSE: Error creando EventSource', error);
      setError('Error al establecer conexión con el servidor');
      setIsConnected(false);
    }
  }, [getSSEUrl]);

  /**
   * Cerrar conexión SSE
   */
  const disconnectSSE = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsConnected(false);

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  /**
   * Marcar notificación como leída
   */
  const markAsRead = useCallback(async (notificationId: number) => {
    try {
      const updated = await notificationsApi.markAsRead(notificationId);
      
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? updated : n))
      );

      // Actualizar stats solo si la notificación no estaba previamente leída
      setNotifications((prevNotifications) => {
        const wasUnread = prevNotifications.find(n => n.id === notificationId)?.isRead === false;
        if (wasUnread) {
          setStats((prev) => ({
            ...prev,
            unreadCount: Math.max(0, prev.unreadCount - 1),
          }));
        }
        return prevNotifications;
      });
    } catch (err) {
      console.error('Error marcando notificación como leída:', err);
      throw err;
    }
  }, []);

  /**
   * Marcar todas como leídas
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead();
      
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );

      setStats((prev) => ({
        ...prev,
        unreadCount: 0,
      }));
    } catch (err) {
      console.error('Error marcando todas como leídas:', err);
      throw err;
    }
  }, []);

  /**
   * Cargar datos iniciales desde la API REST
   */
  const loadInitialData = useCallback(async () => {
    try {
      // Solo mostrar loading si es la primera carga
      if (!hasLoadedInitially) {
        setIsLoading(true);
      }
      
      // Cargar notificaciones iniciales y estadísticas en paralelo
      const [notificationsResponse, statsResponse] = await Promise.all([
        notificationsApi.getNotifications({ page: 0, size: 10 }),
        notificationsApi.getStats()
      ]);
      
      setNotifications(notificationsResponse.notifications);
      setStats(statsResponse);
      setHasLoadedInitially(true);
      setError(null);
      
      console.log('📨 Datos iniciales cargados:', {
        notifications: notificationsResponse.notifications.length,
        stats: statsResponse
      });
      
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
      setError('Error al cargar las notificaciones');
    } finally {
      setIsLoading(false);
    }
  }, [hasLoadedInitially]);

  // Inicializar al montar - Cargar datos REST primero, luego SSE
  useEffect(() => {
    // 1. Cargar datos iniciales desde REST API
    loadInitialData();
    
    // 2. Conectar SSE para actualizaciones en tiempo real
    connectSSE();

    // Limpiar al desmontar
    return () => {
      disconnectSSE();
    };
  }, [loadInitialData, connectSSE, disconnectSSE]);

  // Reconectar cuando la ventana recupera foco
  useEffect(() => {
    const handleFocus = () => {
      if (!isConnected && reconnectAttempts.current < maxReconnectAttempts) {
        console.log('📡 SSE: Ventana recuperó foco, reconectando...');
        connectSSE();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isConnected, connectSSE]);

  return {
    notifications,
    stats,
    isConnected,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    connect: connectSSE,
    disconnect: disconnectSSE,
    refresh: loadInitialData,
  };
}


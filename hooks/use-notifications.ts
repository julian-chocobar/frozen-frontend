"use client";

import { useEffect, useState } from 'react';
import { notificationsApi } from '@/lib/notifications-api';
import type { NotificationResponseDTO, NotificationStats } from '@/types';

type NotificationsState = {
  notifications: NotificationResponseDTO[];
  stats: NotificationStats;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
};

type Subscriber = (state: NotificationsState) => void;

// Estado compartido a nivel de módulo (singleton por pestaña)
const subscribers = new Set<Subscriber>();
let eventSource: EventSource | null = null;
let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
const reconnectDelayMs = 3000;
let hasLoadedInitially = false;
let started = false;
let focusListenerAttached = false;
let cachedBackendUrl: string | null = null;

const state: NotificationsState = {
  notifications: [],
  stats: { unreadCount: 0, totalCount: 0 },
  isConnected: false,
  isLoading: true,
  error: null,
};

function notify() {
  for (const sub of subscribers) sub({ ...state });
}

/**
 * Obtiene la URL del backend desde el servidor o usa la variable de entorno pública
 */
async function getBackendUrl(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  
  // Si ya tenemos la URL en caché, usarla
  if (cachedBackendUrl) {
    return cachedBackendUrl;
  }
  
  // Intentar obtener desde variable de entorno pública (más rápido)
  if (process.env.NEXT_PUBLIC_BACKEND_URL) {
    cachedBackendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    return cachedBackendUrl;
  }
  
  // Si no está disponible, obtenerla desde el servidor
  try {
    const response = await fetch('/api/backend-config');
    if (response.ok) {
      const data = await response.json();
      cachedBackendUrl = data.backendUrl;
      return cachedBackendUrl;
    }
  } catch (error) {
    console.error('📡 SSE: Error obteniendo configuración del backend:', error);
  }
  
  // Fallback: usar localhost en desarrollo
  if (process.env.NODE_ENV === 'development') {
    cachedBackendUrl = 'http://localhost:8080';
    return cachedBackendUrl;
  }
  
  // Fallback: usar el origen actual en producción
  cachedBackendUrl = window.location.origin;
  return cachedBackendUrl;
}

function getSSEUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  // Usar el proxy de Next.js para SSE, así las cookies se envían correctamente
  // El endpoint /api/notifications/stream actúa como proxy al backend
  const url = '/api/notifications/stream';
  
  console.log('📡 SSE: URL construida (usando proxy):', url);
  
  return url;
}

async function loadInitialDataOnce() {
  try {
    if (!hasLoadedInitially) {
      state.isLoading = true;
      notify();
    }
    const [notificationsResponse, statsResponse] = await Promise.all([
      notificationsApi.getNotifications({ page: 0, size: 10 }),
      notificationsApi.getStats(),
    ]);
    state.notifications = notificationsResponse.notifications;
    state.stats = statsResponse;
    state.error = null;
    hasLoadedInitially = true;
  } catch (err) {
    console.error('Error cargando datos iniciales:', err);
    state.error = 'Error al cargar las notificaciones';
  } finally {
    state.isLoading = false;
    notify();
  }
}

function attachWindowFocusReconnect() {
  if (typeof window === 'undefined' || focusListenerAttached) return;
  const onFocus = () => {
    if (!state.isConnected && reconnectAttempts < maxReconnectAttempts) {
      console.log('📡 SSE: Ventana recuperó foco, reconectando...');
      connectSSE();
    }
  };
  window.addEventListener('focus', onFocus);
  focusListenerAttached = true;
}

function connectSSE() {
  const url = getSSEUrl();
  if (!url) {
    console.error('📡 SSE: No se pudo construir la URL');
    return;
  }

  // Si ya existe una conexión, no crear otra
  if (eventSource) {
    console.log('📡 SSE: Ya existe una conexión activa, omitiendo...');
    return;
  }

  console.log('📡 SSE: Intentando conectar a:', url);
  
  try {
    const es = new EventSource(url, { withCredentials: true });

    es.onopen = () => {
      console.log('📡 SSE: Conexión establecida');
      state.isConnected = true;
      state.error = null;
      reconnectAttempts = 0;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
        reconnectTimeout = null;
      }
      notify();
    };

    es.onerror = (event) => {
      const errorInfo = {
        type: event.type,
        readyState: es.readyState,
        url: es.url,
        readyStateText: es.readyState === EventSource.CONNECTING ? 'CONNECTING' : 
                        es.readyState === EventSource.OPEN ? 'OPEN' : 
                        es.readyState === EventSource.CLOSED ? 'CLOSED' : 'UNKNOWN'
      };
      console.error('📡 SSE: Error en conexión', errorInfo, event);
      state.isConnected = false;
      notify();

      if (es.readyState === EventSource.CLOSED) {
        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts += 1;
          console.log(`📡 SSE: Reintentando conexión (${reconnectAttempts}/${maxReconnectAttempts})...`);
          reconnectTimeout = setTimeout(() => {
            disconnectSSE();
            connectSSE();
          }, reconnectDelayMs);
        } else {
          state.error = `No se pudo conectar al servidor de notificaciones. URL: ${es.url}`;
          console.error('📡 SSE: Máximo de intentos de reconexión alcanzado', {
            url: es.url,
            readyState: es.readyState
          });
          notify();
        }
      } else if (es.readyState === EventSource.CONNECTING) {
        // El EventSource está intentando reconectar automáticamente
        console.log('📡 SSE: Reconectando automáticamente...');
      }
    };

    es.addEventListener('connected', (event: MessageEvent) => {
      console.log('📡 SSE: Evento connected recibido', event.data);
    });

    es.addEventListener('initial-notifications', (event: MessageEvent) => {
      try {
        const initialNotifications: NotificationResponseDTO[] = JSON.parse(event.data);
        console.log('📨 SSE: Notificaciones iniciales recibidas', initialNotifications.length);
        if (initialNotifications.length > state.notifications.length) {
          state.notifications = initialNotifications;
          notify();
        }
      } catch (error) {
        console.error('📡 SSE: Error parsing initial notifications', error);
      }
    });

    es.addEventListener('notification', (event: MessageEvent) => {
      try {
        const notification: NotificationResponseDTO = JSON.parse(event.data);
        console.log('📨 SSE: Nueva notificación recibida', notification);
        state.notifications = [notification, ...state.notifications];
        state.stats = {
          unreadCount: state.stats.unreadCount + 1,
          totalCount: state.stats.totalCount + 1,
        };
        notify();
      } catch (error) {
        console.error('📡 SSE: Error parsing notification', error);
      }
    });

    es.addEventListener('stats-update', (event: MessageEvent) => {
      try {
        const newStats: NotificationStats = JSON.parse(event.data);
        console.log('📊 SSE: Actualización de estadísticas', newStats);
        state.stats = newStats;
        notify();
      } catch (error) {
        console.error('📡 SSE: Error parsing stats', error);
      }
    });

    eventSource = es;
  } catch (error) {
    console.error('📡 SSE: Error creando EventSource', error);
    state.error = 'Error al establecer conexión con el servidor';
    state.isConnected = false;
    notify();
  }
}

function disconnectSSE() {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
  }
  state.isConnected = false;
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  notify();
}

async function markAsRead(notificationId: number) {
  try {
    const updated = await notificationsApi.markAsRead(notificationId);
    state.notifications = state.notifications.map(n => (n.id === notificationId ? updated : n));
    const wasUnread = state.notifications.find(n => n.id === notificationId)?.isRead === true;
    if (wasUnread) {
      state.stats = {
        ...state.stats,
        unreadCount: Math.max(0, state.stats.unreadCount - 1),
      };
    }
    notify();
  } catch (err) {
    console.error('Error marcando notificación como leída:', err);
    throw err;
  }
}

async function markAllAsRead() {
  try {
    await notificationsApi.markAllAsRead();
    const nowIso = new Date().toISOString();
    state.notifications = state.notifications.map(n => ({ ...n, isRead: true, readAt: nowIso }));
    state.stats = { ...state.stats, unreadCount: 0 };
    notify();
  } catch (err) {
    console.error('Error marcando todas como leídas:', err);
    throw err;
  }
}

function subscribe(sub: Subscriber) {
  subscribers.add(sub);
  // Emitir estado inicial
  sub({ ...state });
  return () => {
    subscribers.delete(sub);
  };
}

async function ensureStarted() {
  if (started) return;
  started = true;
  attachWindowFocusReconnect();
  
  // Obtener la URL del backend antes de conectar SSE
  if (!cachedBackendUrl && typeof window !== 'undefined') {
    await getBackendUrl();
  }
  
  await loadInitialDataOnce();
  connectSSE();
}

export function useNotifications() {
  const [localState, setLocalState] = useState<NotificationsState>(state);

  useEffect(() => {
    const unsubscribe = subscribe(setLocalState);
    void ensureStarted();
    return unsubscribe;
  }, []);

  return {
    notifications: localState.notifications,
    stats: localState.stats,
    isConnected: localState.isConnected,
    isLoading: localState.isLoading,
    error: localState.error,
    markAsRead,
    markAllAsRead,
    connect: connectSSE,
    disconnect: disconnectSSE,
    refresh: loadInitialDataOnce,
  };
}



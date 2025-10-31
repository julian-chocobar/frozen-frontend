'use client';

import React, { createContext, useContext } from 'react';
import { useNotifications } from '@/hooks/use-notifications';
import type { NotificationResponseDTO, NotificationStats } from '@/types';

interface NotificationsContextValue {
  notifications: NotificationResponseDTO[];
  stats: NotificationStats;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  connect: () => void;
  disconnect: () => void;
  refresh: () => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const value = useNotifications();
  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext(): NotificationsContextValue {
  const ctx = useContext(NotificationsContext);
  if (ctx === undefined) {
    throw new Error('useNotificationsContext debe usarse dentro de NotificationsProvider');
  }
  return ctx;
}



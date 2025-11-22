/**
 * Estado vacío para el módulo de notificaciones
 * Se muestra cuando no hay notificaciones para mostrar
 */

import { Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationsEmptyStateProps {
  /** Título del estado vacío */
  title?: string;
  /** Descripción del estado vacío */
  description?: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente de estado vacío para notificaciones
 * 
 * @example
 * ```tsx
 * <NotificationsEmptyState 
 *   title="No hay notificaciones sin leer"
 *   description="Todas tus notificaciones están al día"
 * />
 * ```
 */
export function NotificationsEmptyState({
  title = 'No hay notificaciones',
  description = 'Las notificaciones aparecerán aquí',
  className,
}: NotificationsEmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center px-4', className)}>
      <div className="p-4 bg-primary-50 border-2 border-primary-200 rounded-full mb-4">
        <Bell className="w-10 h-10 text-primary-600" />
      </div>
      <p className="text-lg font-semibold text-primary-900 mb-2">{title}</p>
      <p className="text-sm text-primary-600 max-w-md">{description}</p>
    </div>
  );
}

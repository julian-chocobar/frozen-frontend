/**
 * Estado de carga para el módulo de notificaciones
 * Muestra un spinner y mensaje de carga mientras se obtienen datos
 */

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationsLoadingStateProps {
  /** Variante del estado de carga */
  variant?: 'default' | 'compact';
  /** Mensaje personalizado de carga */
  message?: string;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente de estado de carga para notificaciones
 * 
 * @example
 * ```tsx
 * <NotificationsLoadingState variant="compact" />
 * ```
 */
export function NotificationsLoadingState({
  variant = 'default',
  message = 'Cargando notificaciones...',
  className,
}: NotificationsLoadingStateProps) {
  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center justify-center py-8', className)}>
        <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center justify-center py-12 gap-4', className)}>
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
      <p className="text-sm text-primary-600 font-medium">{message}</p>
    </div>
  );
}

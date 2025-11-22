/**
 * Estado de error para el módulo de notificaciones
 * Muestra un mensaje de error y permite reintentar la operación
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NotificationsErrorStateProps {
  /** Mensaje de error a mostrar */
  error: string;
  /** Función a ejecutar al hacer clic en reintentar */
  onRetry?: () => void;
  /** Clases CSS adicionales */
  className?: string;
}

/**
 * Componente de estado de error para notificaciones
 * 
 * @example
 * ```tsx
 * <NotificationsErrorState 
 *   error="Error al cargar notificaciones"
 *   onRetry={refetch}
 * />
 * ```
 */
export function NotificationsErrorState({
  error,
  onRetry,
  className,
}: NotificationsErrorStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center px-4', className)}>
      <div className="p-4 bg-red-50 border-2 border-red-200 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <p className="text-lg font-semibold text-primary-900 mb-2">Error al cargar</p>
      <p className="text-sm text-primary-600 mb-6 max-w-md">{error}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          Reintentar
        </Button>
      )}
    </div>
  );
}

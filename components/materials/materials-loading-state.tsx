/**
 * Componente MaterialsLoadingState - Estado de carga compartido para materiales
 * Muestra un spinner consistente durante la carga de datos
 * 
 * @example
 * ```tsx
 * if (loading) {
 *   return <MaterialsLoadingState />
 * }
 * ```
 */

import { Loader2 } from 'lucide-react'

interface MaterialsLoadingStateProps {
  /** Mensaje personalizado de carga */
  message?: string
  /** Variante del estilo (compacto para modales/cards) */
  variant?: 'default' | 'compact'
}

export function MaterialsLoadingState({ 
  message = 'Cargando materiales...', 
  variant = 'default' 
}: MaterialsLoadingStateProps) {
  const padding = variant === 'compact' ? 'py-8' : 'py-12'
  const iconSize = variant === 'compact' ? 'w-8 h-8' : 'w-12 h-12'

  return (
    <div className={`flex flex-col items-center justify-center ${padding} gap-3`}>
      <Loader2 className={`${iconSize} text-primary-600 animate-spin`} />
      <p className="text-sm text-primary-600 font-medium">{message}</p>
    </div>
  )
}

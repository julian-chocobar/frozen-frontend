/**
 * Componente MovementDetails
 * Componente para mostrar detalles completos de un movimiento
 */

import { ArrowUp, ArrowDown, Calendar, Package, X, Clock, Play, CheckCircle, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MovementDetailResponse } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"
import { getStatusLabel } from "@/lib/movements-api"

interface MovementDetailsProps {
  movement: MovementDetailResponse
  onClose: () => void
  onToggleInProgress?: (id: string) => Promise<void>
  onComplete?: (id: string) => Promise<void>
  isLoading?: boolean
}

export function MovementDetails({ 
  movement, 
  onClose,
  onToggleInProgress,
  onComplete,
  isLoading = false
}: MovementDetailsProps) {
  const isIngreso = movement.type === 'INGRESO'
  
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {isIngreso ? (
                  <ArrowUp className="w-6 h-6 text-green-600" />
                ) : (
                  <ArrowDown className="w-6 h-6 text-red-600" />
                )}
                <h3 className={cn(
                  "text-lg font-semibold",
                  isIngreso ? "text-green-800" : "text-red-800"
                )}>
                  {isIngreso ? 'Ingreso de Stock' : 'Egreso de Stock'}
                </h3>
              </div>
              <p className="text-sm text-primary-600 font-mono">#{movement.id}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del movimiento */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-900">Información del Movimiento</h4>
              
              <div>
                <label className="text-sm text-primary-700">Tipo de Movimiento</label>
                <div className="mt-1">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                    isIngreso 
                      ? "bg-green-100 text-green-800" 
                      : "bg-red-100 text-red-800"
                  )}>
                    {isIngreso ? (
                      <>
                        <ArrowUp className="w-4 h-4" />
                        Ingreso
                      </>
                    ) : (
                      <>
                        <ArrowDown className="w-4 h-4" />
                        Egreso
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-primary-700">Estado</label>
                <div className="mt-1">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                    movement.status === 'PENDIENTE' && "bg-yellow-100 text-yellow-800",
                    movement.status === 'EN_PROCESO' && "bg-blue-100 text-blue-800", 
                    movement.status === 'COMPLETADO' && "bg-green-100 text-green-800"
                  )}>
                    {getStatusLabel(movement.status)}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm text-primary-700">Cantidad</label>
                <p className="text-sm font-medium text-primary-900">
                  {movement.stock} {getUnitLabel(movement.unitMeasurement)}
                </p>
              </div>

              <div>
                <label className="text-sm text-primary-700">Ubicación</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <p className="text-sm font-medium text-primary-900">{movement.location}</p>
                </div>
              </div>

              {movement.reason && (
                <div>
                  <label className="text-sm text-primary-700">Motivo</label>
                  <p className="text-sm font-medium text-primary-900">{movement.reason}</p>
                </div>
              )}
            </div>

            {/* Información del material */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-900">Material Afectado</h4>
              
              <div>
                <label className="text-sm text-primary-700">Código del Material</label>
                <p className="text-sm font-medium text-primary-900 font-mono">{movement.materialCode}</p>
              </div>

              <div>
                <label className="text-sm text-primary-700">Nombre del Material</label>
                <p className="text-sm font-medium text-primary-900">{movement.materialName}</p>
              </div>

              <div>
                <label className="text-sm text-primary-700">Tipo de Material</label>
                <div className="flex items-center gap-2 mt-1">
                  <Package className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-900">{getTypeLabel(movement.materialType)}</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-primary-700">ID del Material</label>
                <p className="text-sm font-medium text-primary-900 font-mono">{movement.materialId}</p>
              </div>
            </div>
          </div>

          {/* Información de fechas y usuarios */}
          <div className="pt-4 border-t border-stroke">
            <h4 className="font-medium text-primary-900 mb-4">Información de Fechas y Usuarios</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-primary-700">Fecha de Creación</label>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <p className="text-sm font-medium text-primary-900">
                    {new Date(movement.creationDate).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              {movement.realizationDate && (
                <div>
                  <label className="text-sm text-primary-700">Fecha de Realización</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-primary-600" />
                    <p className="text-sm font-medium text-primary-900">
                      {new Date(movement.realizationDate).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              )}

              {movement.createdByUserId && (
                <div>
                  <label className="text-sm text-primary-700">Creado por Usuario ID</label>
                  <p className="text-sm font-medium text-primary-900 font-mono">{movement.createdByUserId}</p>
                </div>
              )}

              {movement.completedByUserId && (
                <div>
                  <label className="text-sm text-primary-700">Completado por Usuario ID</label>
                  <p className="text-sm font-medium text-primary-900 font-mono">{movement.completedByUserId}</p>
                </div>
              )}

              {movement.inProgressByUserId && (
                <div>
                  <label className="text-sm text-primary-700">En proceso por Usuario ID</label>
                  <p className="text-sm font-medium text-primary-900 font-mono">{movement.inProgressByUserId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <h5 className="font-medium text-blue-800 mb-2">ℹ️ Información Adicional</h5>
            <p className="text-sm text-blue-700">
              Este movimiento {isIngreso ? 'aumentó' : 'disminuyó'} el stock del material 
              <strong> {movement.materialName}</strong> en <strong>{movement.stock} {getUnitLabel(movement.unitMeasurement)}</strong>.
              {isIngreso ? ' El stock fue agregado al inventario.' : ' El stock fue retirado del inventario.'}
            </p>
          </div>

          {/* Botones de gestión de estado */}
          {(movement.status === 'PENDIENTE' || movement.status === 'EN_PROCESO') && (onToggleInProgress || onComplete) && (
            <div className="pt-4 border-t border-stroke">
              <h4 className="font-medium text-primary-900 mb-4">Gestión de Estado</h4>
              <div className="flex flex-wrap gap-3">
                
                {/* Botón para marcar/desmarcar como en proceso */}
                {onToggleInProgress && (movement.status === 'PENDIENTE' || movement.status === 'EN_PROCESO') && (
                  <button
                    onClick={() => onToggleInProgress(movement.id)}
                    disabled={isLoading}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      movement.status === 'EN_PROCESO' 
                        ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" 
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Play className="w-4 h-4" />
                    {movement.status === 'EN_PROCESO' ? 'Marcar como Pendiente' : 'Marcar como En Proceso'}
                  </button>
                )}

                {/* Botón para completar movimiento */}
                {onComplete && (movement.status === 'PENDIENTE' || movement.status === 'EN_PROCESO') && (
                  <button
                    onClick={() => onComplete(movement.id)}
                    disabled={isLoading}
                    className={cn(
                      "inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors bg-green-100 text-green-800 hover:bg-green-200",
                      isLoading && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Completar Movimiento
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-stroke">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              <X className="w-4 h-4" />
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

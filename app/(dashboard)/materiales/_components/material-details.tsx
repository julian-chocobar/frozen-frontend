/**
 * Componente MaterialDetails
 * Componente para mostrar detalles completos de un material
 */

import { Edit, Trash2, Power, PowerOff, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MaterialDetailResponse } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MaterialDetailsProps {
  material: MaterialDetailResponse
  onClose: () => void
  onEdit: () => void
  onToggleActive: () => void
}

export function MaterialDetails({ 
  material, 
  onClose, 
  onEdit,  
  onToggleActive 
}: MaterialDetailsProps) {
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
              <h3 className="text-lg font-semibold text-primary-900">{material.name}</h3>
              <p className="text-sm text-primary-600 font-mono">{material.code}</p>
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
            {/* Información básica */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-900">Información Básica</h4>
              
              <div>
                <label className="text-sm text-primary-700">Categoría</label>
                <p className="text-sm font-medium text-primary-900">{getTypeLabel(material.type)}</p>
              </div>

              <div>
                <label className="text-sm text-primary-700">Proveedor</label>
                <p className="text-sm font-medium text-primary-900">{material.supplier}</p>
              </div>

              <div>
                <label className="text-sm text-primary-700">Estado</label>
                <div className="mt-1">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                    material.isActive
                      ? "bg-green-100 text-green-800" 
                      : "bg-gray-100 text-gray-800"
                  )}>
                    {material.isActive ? (
                      <>
                        <Power className="w-4 h-4" />
                        Activo
                      </>
                    ) : (
                      <>
                        <PowerOff className="w-4 h-4" />
                        Inactivo
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Información de stock */}
            <div className="space-y-4">
              <h4 className="font-medium text-primary-900">Información de Stock</h4>
              
              {/* Stock Disponible */}
              <div>
                <label className="text-sm text-primary-700">Stock Disponible</label>
                <p className="text-lg font-bold text-green-600">
                  {material.availableStock ?? 0} {getUnitLabel(material.unitMeasurement)}
                </p>
              </div>

              {/* Stock Reservado */}
              <div>
                <label className="text-sm text-primary-700">Stock Reservado</label>
                <p className="text-lg font-bold text-orange-600">
                  {material.reservedStock ?? 0} {getUnitLabel(material.unitMeasurement)}
                </p>
              </div>

              {/* Stock Mínimo */}
              <div>
                <label className="text-sm text-primary-700">Stock Mínimo</label>
                <p className="text-sm font-medium text-primary-900">
                  {material.threshold} {getUnitLabel(material.unitMeasurement)}
                </p>
              </div>

              {/* Costo Unitario */}
              <div>
                <label className="text-sm text-primary-700">Costo Unitario</label>
                <p className="text-sm font-medium text-primary-900">${material.value}</p>
              </div>
            </div>
          </div>

          {/* Información de fechas */}
          <div className="pt-4 border-t border-stroke">
            <h4 className="font-medium text-primary-900 mb-4">Información de Fechas</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-primary-700">Última Actualización</label>
                <p className="text-sm font-medium text-primary-900">
                  {new Date().toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Alertas de stock */}
          {material.isBelowThreshold && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-medium text-red-800 mb-2">⚠️ Alerta de Stock</h5>
              <p className="text-sm text-red-700">
                El stock disponible ({material.availableStock ?? 0} {getUnitLabel(material.unitMeasurement)}) está por debajo del umbral mínimo 
                ({material.threshold} {getUnitLabel(material.unitMeasurement)}). Se recomienda realizar un pedido.
              </p>
            </div>
          )}

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 pt-6 border-t border-stroke">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
            >
              <Edit className="w-4 h-4" />
              Editar
            </button>
            
            <button
              onClick={onToggleActive}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium text-sm",
                material.isActive
                  ? "bg-yellow-600 text-white hover:bg-yellow-700"
                  : "bg-green-600 text-white hover:bg-green-700"
              )}
            >
              {material.isActive ? (
                <>
                  <PowerOff className="w-4 h-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <Power className="w-4 h-4" />
                  Activar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
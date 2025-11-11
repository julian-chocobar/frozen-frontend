/**
 * Componente MaterialDetails
 * Componente para mostrar detalles completos de un material
 */

import { Edit, MapPin, Power, PowerOff, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MaterialDetailResponse } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MaterialDetailsProps {
  material: MaterialDetailResponse
  onClose: () => void
  onEdit: () => void
  onToggleActive: () => void
}

const normalizeZoneName = (zone?: string | null) => {
  if (!zone) return null
  const cleaned = zone.replace(/^ZONA[_-]?/i, '').replace(/_/g, ' ').trim()
  if (!cleaned) return zone
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase()
}

export function MaterialDetails({ 
  material, 
  onClose, 
  onEdit,  
  onToggleActive 
}: MaterialDetailsProps) {
  const supplier = material.supplier || '—'
  const value = material.value ?? '—'
  const zone = normalizeZoneName(material.warehouseZone) ?? '—'
  const section = material.warehouseSection ?? '—'
  const level = material.warehouseLevel ?? '—'
  const currentStock = material.availableStock ?? material.totalStock ?? 0
  const reservedStock = material.reservedStock ?? 0

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ 
        backgroundColor: 'rgba(37, 99, 235, 0.08)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
    >
      <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-200">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-primary-900">{material.name}</h3>
              <p className="text-sm text-primary-600 font-mono">{material.code}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
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
                <p className="text-sm font-medium text-primary-900">{supplier}</p>
              </div>

              <div>
                <label className="text-sm text-primary-700">Estado</label>
                <div className="mt-1">
                  <span className={cn(
                    "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border",
                    material.isActive
                      ? "bg-green-100 text-green-700 border-green-200" 
                      : "bg-primary-50 text-primary-700 border-primary-200"
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
                  {currentStock} {getUnitLabel(material.unitMeasurement)}
                </p>
              </div>

              {/* Stock Reservado */}
              <div>
                <label className="text-sm text-primary-700">Stock Reservado</label>
                <p className="text-lg font-bold text-orange-600">
                  {reservedStock} {getUnitLabel(material.unitMeasurement)}
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
                <p className="text-sm font-medium text-primary-900">${value}</p>
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

          {/* Ubicación en almacén */}
          <div className="pt-4 border-t border-stroke">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-primary-600" />
              <h4 className="font-medium text-primary-900">Ubicación en el almacén</h4>
            </div>

            {material.warehouseZone ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <label className="text-xs uppercase tracking-wide text-primary-600">Zona</label>
                  <p className="font-semibold text-primary-900">{zone}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-primary-600">Sección</label>
                  <p className="font-semibold text-primary-900">{section}</p>
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wide text-primary-600">Nivel</label>
                  <p className="font-semibold text-primary-900">{level}</p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-primary-600">Este material no tiene una ubicación asignada actualmente.</p>
            )}
          </div>

          {/* Alertas de stock */}
          {material.isBelowThreshold && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h5 className="font-medium text-red-800 mb-2">⚠️ Alerta de Stock</h5>
              <p className="text-sm text-red-700">
                El stock disponible ({currentStock} {getUnitLabel(material.unitMeasurement)}) está por debajo del umbral mínimo 
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
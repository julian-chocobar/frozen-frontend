/**
 * Componente MaterialsCards - Cards de materiales para móvil
 * Transforma la tabla en cards apiladas para pantallas pequeñas
 */

import { Edit, Trash2, Package, Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Material } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MaterialsCardsProps {
  materiales: Material[]
  onEdit?: (material: Material) => void
  onDelete?: (material: Material) => void
  onToggleActive?: (material: Material) => void
  onViewDetails?: (material: Material) => void
}

export function MaterialsCards({ 
  materiales, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onViewDetails 
}: MaterialsCardsProps) {
  return (
    <div className="md:hidden space-y-4">
      {materiales.map((material) => (
        <div key={material.id} className="bg-white border border-stroke rounded-lg p-4 shadow-sm">
          {/* Header con código y estado */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-mono text-primary-600 mb-1">{material.code}</p>
              <h3 className="text-base font-semibold text-primary-900">{material.name}</h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className={cn(
                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                material.isActive
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              )}>
                {material.isActive ? (
                  <>
                    <Power className="w-3 h-3" />
                    Activo
                  </>
                ) : (
                  <>
                    <PowerOff className="w-3 h-3" />
                    Inactivo
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-primary-700 mb-1">Categoría</p>
              <p className="text-sm font-medium text-primary-600">{getTypeLabel(material.type)}</p>
            </div>
            <div>
              <p className="text-xs text-primary-700 mb-1">Stock</p>
              <p className="text-sm font-bold text-primary-900">
                {material.stock} {getUnitLabel(material.unitMeasurement)}
              </p>
              <p className="text-xs text-primary-700">
                Mín: {material.threshold} {getUnitLabel(material.unitMeasurement)}
              </p>
            </div>
          </div>

          {/* Información secundaria */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-primary-700 mb-1">Proveedor</p>
              <p className="text-sm font-medium text-primary-800">{material.supplier}</p>
            </div>
            <div>
              <p className="text-xs text-primary-700 mb-1">Costo</p>
              <p className="text-sm font-medium text-primary-900">${material.value}</p>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stroke">
            <button
              onClick={() => onViewDetails?.(material)}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
              aria-label={`Ver detalles de ${material.name}`}
            >
              <Package className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit?.(material)}
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
              aria-label={`Editar ${material.name}`}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onToggleActive?.(material)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                material.isActive
                  ? "hover:bg-yellow-50 text-yellow-600"
                  : "hover:bg-green-50 text-green-600"
              )}
              aria-label={material.isActive ? `Desactivar ${material.name}` : `Activar ${material.name}`}
            >
              {material.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
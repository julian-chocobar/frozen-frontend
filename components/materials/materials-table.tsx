/**
 * Componente MaterialsTable - Tabla de materiales para desktop
 * Muestra todos los materiales en formato tabla
 */

import { Edit, Trash2, Package, Power, PowerOff } from "lucide-react"
import { cn, obtenerColorEstado } from "@/lib/utils"
import type { Material } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MaterialsTableProps {
  materiales: Material[]
  onEdit?: (material: Material) => void
  onDelete?: (material: Material) => void
  onToggleActive?: (material: Material) => void
  onViewDetails?: (material: Material) => void
}

export function MaterialsTable({ 
  materiales, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  onViewDetails 
}: MaterialsTableProps) {
  return (
    <div className="hidden md:block overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stroke bg-surface-secondary">
            <th className="text-left py-3 px-4 text-sm font-semibold text-primary-900">Código</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-primary-900">Material</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-primary-900">Categoría</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-primary-900">Stock</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-primary-900">Proveedor</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-primary-900">Estado</th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-primary-900">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materiales.map((material) => (
            <tr key={material.id} className="border-b border-stroke hover:bg-surface-secondary transition-colors">
              <td className="py-4 px-4">
                <span className="text-sm font-mono text-primary-600">{material.code}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-medium text-primary-900">{material.name}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-primary-600">{getTypeLabel(material.type)}</span>
              </td>
              <td className="py-4 px-4">
                <div>
                  <p className="text-sm font-bold text-primary-900">
                    {material.stock} {getUnitLabel(material.unitMeasurement)}
                  </p>
                  <p className="text-xs text-primary-700">
                    Mín: {material.threshold} {getUnitLabel(material.unitMeasurement)}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-primary-800">{material.supplier}</span>
              </td>
              <td className="py-4 px-4">
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
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

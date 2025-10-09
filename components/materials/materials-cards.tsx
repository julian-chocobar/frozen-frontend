/**
 * Componente MaterialsCards - Tarjetas de materiales para móvil
 * Transforma la tabla en cards apiladas para pantallas pequeñas
 */

import { Edit, Trash2, Package } from "lucide-react"
import { cn, obtenerColorEstado } from "@/lib/utils"
import type { Material } from "@/types"

interface MaterialsCardsProps {
  materiales: Material[]
}

export function MaterialsCards({ materiales }: MaterialsCardsProps) {
  return (
    <div className="md:hidden space-y-4 p-4">
      {materiales.map((material) => (
        <div key={material.id} className="card p-4 border-2 border-primary-600">
          {/* Header con código y estado */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs font-mono text-primary-600 mb-1">{material.codigo}</p>
              <h3 className="text-base font-semibold text-primary-900">{material.nombre}</h3>
            </div>
            <span className={cn("badge", obtenerColorEstado(material.estado))}>{material.estado}</span>
          </div>

          {/* Información principal */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-xs text-primary-700 mb-1">Categoría</p>
              <p className="text-sm font-medium text-primary-600">{material.categoria}</p>
            </div>
            <div>
              <p className="text-xs text-primary-700 mb-1">Stock</p>
              <p className="text-sm font-bold text-primary-900">
                {material.stock} {material.unidad}
              </p>
              <p className="text-xs text-primary-700">
                Mín: {material.stockMinimo} {material.unidad}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-primary-700 mb-1">Proveedor</p>
              <p className="text-sm font-medium text-primary-900">{material.proveedor}</p>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2 pt-3 border-t border-stroke">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors text-sm font-medium"
              aria-label={`Ver detalles de ${material.nombre}`}
            >
              <Package className="w-4 h-4" />
              <span>Detalles</span>
            </button>
            <button
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
              aria-label={`Editar ${material.nombre}`}
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              className="p-2 hover:bg-alert-50 rounded-lg transition-colors text-alert-600"
              aria-label={`Eliminar ${material.nombre}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

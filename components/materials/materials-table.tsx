/**
 * Componente MaterialsTable - Tabla de materiales para desktop
 * Muestra todos los materiales en formato tabla
 */

import { Edit, Trash2, Package } from "lucide-react"
import { cn, obtenerColorEstado } from "@/lib/utils"
import type { Material } from "@/types"

interface MaterialsTableProps {
  materiales: Material[]
}

export function MaterialsTable({ materiales }: MaterialsTableProps) {
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
                <span className="text-sm font-mono text-primary-600">{material.codigo}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm font-medium text-primary-900">{material.nombre}</span>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-primary-600">{material.categoria}</span>
              </td>
              <td className="py-4 px-4">
                <div>
                  <p className="text-sm font-bold text-primary-900">
                    {material.stock} {material.unidad}
                  </p>
                  <p className="text-xs text-primary-700">
                    Mín: {material.stockMinimo} {material.unidad}
                  </p>
                </div>
              </td>
              <td className="py-4 px-4">
                <span className="text-sm text-primary-800">{material.proveedor}</span>
              </td>
              <td className="py-4 px-4">
                <span className={cn("badge", obtenerColorEstado(material.estado))}>{material.estado}</span>
              </td>
              <td className="py-4 px-4">
                <div className="flex items-center justify-end gap-2">
                  <button
                    className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                    aria-label={`Ver detalles de ${material.nombre}`}
                  >
                    <Package className="w-4 h-4" />
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

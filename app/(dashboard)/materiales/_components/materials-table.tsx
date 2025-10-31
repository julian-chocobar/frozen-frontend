/**
 * Componente MaterialsTable - Wrapper específico para materiales usando DataTable genérico
 * Muestra todos los materiales en formato tabla para desktop
 */

import { Power, PowerOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import type { Material } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MaterialsTableProps {
  materiales: Material[]
  onEdit?: (material: Material) => void
  onToggleActive?: (material: Material) => void
  onViewDetails?: (material: Material) => void
}

export function MaterialsTable({ 
  materiales, 
  onEdit, 
  onToggleActive, 
  onViewDetails 
}: MaterialsTableProps) {
  const columns: ColumnDef<Material>[] = [
    {
      key: 'code',
      label: 'Código',
      render: (value) => (
        <span className="text-sm font-mono text-primary-600">{value}</span>
      )
    },
    {
      key: 'name',
      label: 'Material',
      render: (value) => (
        <span className="text-sm font-medium text-primary-900">{value}</span>
      )
    },
    {
      key: 'type',
      label: 'Categoría',
      render: (value) => (
        <span className="text-sm text-primary-600">{getTypeLabel(value)}</span>
      )
    },
    {
      key: 'availableStock',
      label: 'Stock Disponible',
      render: (value, material) => (
        <div>
          <p className="text-sm font-bold text-primary-900">
            {value} {getUnitLabel(material.unitMeasurement)}
          </p>
          <p className="text-xs text-primary-700">
            Mín: {material.threshold} {getUnitLabel(material.unitMeasurement)}
          </p>
        </div>
      )
    },
    {
      key: 'reservedStock',
      label: 'Stock Reservado',
      render: (value, material) => (
        <div>
          <p className="text-sm font-medium text-orange-900">
            {value} {getUnitLabel(material.unitMeasurement)}
          </p>
        </div>
      )
    },
    {
      key: 'supplier',
      label: 'Proveedor',
      render: (value) => (
        <span className="text-sm text-primary-800">{value}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value, material) => (
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
      )
    }
  ]

  const actions: TableActions<Material> = {
    onView: onViewDetails,
    onEdit,
    onToggleStatus: onToggleActive,
    toggleStatusIcon: (material) => (
      material.isActive ? <PowerOff className="w-4 h-4 text-red-500" /> : <Power className="w-4 h-4 text-green-500" />
    )
  }

  return (
    <div className="hidden md:block">
      <DataTable
        data={materiales}
        columns={columns}
        actions={actions}
        emptyMessage="No hay materiales disponibles"
      />
    </div>
  )
}

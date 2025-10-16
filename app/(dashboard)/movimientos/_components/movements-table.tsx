/**
 * Componente MovementsTable - Wrapper específico para movimientos usando DataTable genérico
 * Muestra todos los movimientos en formato tabla para desktop
 */

import { ArrowUp, ArrowDown, Calendar, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import type { MovementResponse } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MovementsTableProps {
  movements: MovementResponse[]
  onViewDetails?: (movement: MovementResponse) => void
}

export function MovementsTable({ 
  movements, 
  onViewDetails 
}: MovementsTableProps) {
  const columns: ColumnDef<MovementResponse>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <span className="text-sm font-mono text-primary-600">#{value}</span>
      )
    },
    {
      key: 'realizationDate',
      label: 'Fecha',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-600" />
          <span className="text-sm text-primary-800">
            {new Date(value).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </span>
        </div>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => (
        <div className="flex items-center gap-2">
          {value === 'INGRESO' ? (
            <ArrowUp className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-600" />
          )}
          <span className={cn(
            "text-sm font-medium",
            value === 'INGRESO' ? "text-green-800" : "text-red-800"
          )}>
            {value === 'INGRESO' ? 'Ingreso' : 'Egreso'}
          </span>
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Cantidad',
      render: (value, movement) => (
        <div>
          <p className="text-sm font-bold text-primary-900">
            {value} {getUnitLabel(movement.unitMeasurement)}
          </p>
        </div>
      )
    },
    {
      key: 'materialName',
      label: 'Material',
      render: (value) => (
        <span className="text-sm text-primary-800 max-w-xs truncate" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'materialType',
      label: 'Categoría',
      render: (value) => (
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-primary-600" />
          <span className="text-sm text-primary-600">{getTypeLabel(value)}</span>
        </div>
      )
    }
  ]

  const actions: TableActions<MovementResponse> = {
    onView: onViewDetails,
  }

  return (
    <div className="hidden md:block">
      <DataTable
        data={movements}
        columns={columns}
        actions={actions}
        emptyMessage="No hay movimientos disponibles"
      />
    </div>
  )
}

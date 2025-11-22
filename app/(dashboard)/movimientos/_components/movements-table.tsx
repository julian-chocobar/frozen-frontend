/**
 * Componente MovementsTable - Wrapper específico para movimientos usando DataTable genérico
 * Muestra todos los movimientos en formato tabla para desktop
 * 
 * Características:
 * - Visualización en formato tabla para escritorio
 * - Columnas personalizadas para ID, fecha, estado, tipo, material y cantidad
 * - Indicadores visuales con iconos para tipos de movimiento
 * - Badges de color para estados
 * - Integración con acción de ver detalles
 * 
 * @component
 * @example
 * ```tsx
 * <MovementsTable
 *   movements={movements}
 *   onViewDetails={(movement) => handleView(movement)}
 * />
 * ```
 */

import { ArrowUp, ArrowDown, Calendar, Package, Lock, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import type { MovementResponse } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials/api"
import { getStatusLabel } from "@/lib/movements"

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
      key: 'creationDate',
      label: 'Fecha Creación',
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
      key: 'status',
      label: 'Estado',
      render: (value) => (
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          value === 'PENDIENTE' && "bg-yellow-100 text-yellow-800",
          value === 'EN_PROCESO' && "bg-blue-100 text-blue-800", 
          value === 'COMPLETADO' && "bg-green-100 text-green-800",
          value === '' && "-"
        )}>
          {getStatusLabel(value)}
        </span>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => {
        const icon = value === 'INGRESO'
          ? <ArrowUp className="w-4 h-4 text-green-600" />
          : value === 'EGRESO'
          ? <ArrowDown className="w-4 h-4 text-red-600" />
          : value === 'RESERVA'
          ? <Lock className="w-4 h-4 text-orange-600" />
          : <RotateCcw className="w-4 h-4 text-purple-600" />

        const label = value === 'INGRESO'
          ? 'Ingreso'
          : value === 'EGRESO'
          ? 'Egreso'
          : value === 'RESERVA'
          ? 'Reserva'
          : 'Devuelto'

        const colorClass = value === 'INGRESO'
          ? 'text-green-800'
          : value === 'EGRESO'
          ? 'text-red-800'
          : value === 'RESERVA'
          ? 'text-orange-800'
          : 'text-purple-800'

        return (
          <div className="flex items-center gap-2">
            {icon}
            <span className={cn("text-sm font-medium", colorClass)}>
              {label}
            </span>
          </div>
        )
      }
    },
    {
      key: 'materialName',
      label: 'Material',
      render: (value, movement) => (
        <div>
          <span className="text-sm text-primary-900 font-medium max-w-xs truncate" title={value}>
            {value}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <Package className="w-3 h-3 text-primary-500" />
            <span className="text-xs text-primary-600">{getTypeLabel(movement.materialType)}</span>
          </div>
        </div>
      )
    },
    {
      key: 'stock',
      label: 'Cantidad / Unidad',
      render: (value, movement) => (
        <div className="text-sm">
          <span className="font-bold text-primary-900">{value}</span>
          <span className="text-primary-600 ml-1">{getUnitLabel(movement.unitMeasurement)}</span>
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

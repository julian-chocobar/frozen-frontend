/**
 * Componente MovementsCards - Wrapper específico para movimientos usando DataCards genérico
 * Transforma la tabla en cards apiladas para pantallas pequeñas
 */

import { ArrowUp, ArrowDown, Calendar, Package } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataCards, type CardField, type CardLayout, type TableActions } from "@/components/ui/data-cards"
import type { MovementResponse } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"
import { getStatusLabel } from "@/lib/movements-api"

interface MovementsCardsProps {
  movements: MovementResponse[]
  onViewDetails?: (movement: MovementResponse) => void
}

export function MovementsCards({ 
  movements, 
  onViewDetails 
}: MovementsCardsProps) {
  const layout: CardLayout<MovementResponse> = {
    header: [
      {
        key: 'id',
        label: '',
        showLabel: false,
        render: (value) => (
          <p className="text-xs font-mono text-primary-600 mb-1">#{value}</p>
        )
      },
      {
        key: 'type',
        label: '',
        showLabel: false,
        render: (value, movement) => (
          <div className="flex items-center gap-2">
            {value === 'INGRESO' ? (
              <ArrowUp className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-600" />
            )}
            <h3 className={cn(
              "text-base font-semibold",
              value === 'INGRESO' ? "text-green-800" : "text-red-800"
            )}>
              {value === 'INGRESO' ? 'Ingreso' : 'Egreso'}
            </h3>
          </div>
        )
      }
    ],
    content: [
      {
        key: 'materialType',
        label: 'Material',
        render: (value) => (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-600" />
            <span className="text-sm text-primary-600">{getTypeLabel(value)}</span>
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
            value === 'COMPLETADO' && "bg-green-100 text-green-800"
          )}>
            {getStatusLabel(value)}
          </span>
        )
      },
      {
        key: 'reason',
        label: 'Motivo',
        render: (value) => (
          <span className="text-sm text-primary-800 line-clamp-2">{value}</span>
        )
      }
    ],
    footer: [
      {
        key: 'type',
        label: '',
        showLabel: false,
        render: (value) => (
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            value === 'INGRESO' 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"
          )}>
            {value === 'INGRESO' ? (
              <>
                <ArrowUp className="w-3 h-3" />
                Ingreso
              </>
            ) : (
              <>
                <ArrowDown className="w-3 h-3" />
                Egreso
              </>
            )}
          </span>
        )
      }
    ]
  }

  const actions: TableActions<MovementResponse> = {
    onView: onViewDetails,
  }

  return (
    <div className="md:hidden">
      <DataCards
        data={movements}
        layout={layout}
        actions={actions}
        emptyMessage="No hay movimientos disponibles"
      />
    </div>
  )
}
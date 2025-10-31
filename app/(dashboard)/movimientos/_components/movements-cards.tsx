/**
 * Componente MovementsCards - Wrapper específico para movimientos usando DataCards genérico
 * Transforma la tabla en cards apiladas para pantallas pequeñas
 */

import { ArrowUp, ArrowDown, Calendar, Package, Play, CheckCircle, Pause } from "lucide-react"
import { cn } from "@/lib/utils"
import { DataCards, type CardField, type CardLayout, type TableActions } from "@/components/ui/data-cards"
import type { MovementResponse } from "@/types"
import { getTypeLabel, getUnitLabel } from "@/lib/materials-api"

interface MovementsCardsProps {
  movements: MovementResponse[]
  onViewDetails?: (movement: MovementResponse) => void
  onToggleInProgress?: (movement: MovementResponse) => void
  onCompleteMovement?: (movement: MovementResponse) => void
}

export function MovementsCards({ 
  movements, 
  onViewDetails,
  onToggleInProgress,
  onCompleteMovement
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
        key: 'status',
        label: 'Estado',
        render: (value) => (
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
            {
              'bg-yellow-100 text-yellow-800': value === 'PENDIENTE',
              'bg-blue-100 text-blue-800': value === 'EN_PROCESO', 
              'bg-green-100 text-green-800': value === 'COMPLETADO'
            }
          )}>
            {value === 'PENDIENTE' ? 'Pendiente' : 
             value === 'EN_PROCESO' ? 'En Proceso' : 'Completado'}
          </span>
        )
      },
      {
        key: 'reason',
        label: 'Motivo',
        render: (value) => (
          <span className="text-sm text-primary-800 line-clamp-2">{value || 'Sin motivo'}</span>
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

  const getCustomActions = (movement: MovementResponse) => {
    const actions = []
    
    if (movement.status === 'PENDIENTE' || movement.status === 'EN_PROCESO') {
      actions.push({
        label: movement.status === 'PENDIENTE' ? 'Marcar En Proceso' : 'Marcar Pendiente',
        onClick: () => onToggleInProgress?.(movement),
        icon: movement.status === 'PENDIENTE' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />
      })
    }
    
    if (movement.status === 'PENDIENTE' || movement.status === 'EN_PROCESO') {
      actions.push({
        label: 'Completar',
        onClick: () => onCompleteMovement?.(movement),
        icon: <CheckCircle className="w-4 h-4 text-green-600" />
      })
    }
    
    return actions
  }

  const actions: TableActions<MovementResponse> = {
    onView: onViewDetails,
    customActions: getCustomActions
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
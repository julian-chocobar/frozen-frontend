"use client"

/**
 * Tarjetas de órdenes de producción para vista móvil
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataCards } from "@/components/ui/data-cards"
import { Eye, CheckCircle, XCircle, Clock, Calendar, Package } from "lucide-react"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"

interface OrdersCardsProps {
  orders: ProductionOrderResponse[]
  onView: (order: ProductionOrderResponse) => void
  onApprove?: (order: ProductionOrderResponse) => void
  onReject?: (order: ProductionOrderResponse) => void
  onCancel?: (order: ProductionOrderResponse) => void
  isLoading?: boolean
}

export function OrdersCards({ 
  orders, 
  onView, 
  onApprove, 
  onReject, 
  onCancel, 
  isLoading = false 
}: OrdersCardsProps) {
  const getStatusBadge = (status: ProductionOrderStatus) => {
    const statusConfig = {
      Pendiente: { variant: "secondary" as const, label: "Pendiente", icon: Clock },
      Aprobado: { variant: "default" as const, label: "Aprobado", icon: CheckCircle },
      Rechazado: { variant: "destructive" as const, label: "Rechazado", icon: XCircle },
      Cancelada: { variant: "outline" as const, label: "Cancelada", icon: XCircle }
    }
    
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No definida"
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const getUnitLabel = (unit: string) => {
    const unitLabels: Record<string, string> = {
      'KG': 'kg',
      'LT': 'L',
      'UNIDAD': 'unidades'
    }
    return unitLabels[unit] || unit
  }

  const getStatusActions = (order: ProductionOrderResponse) => {
    if (order.status === 'Pendiente') {
      return (
        <div className="flex gap-2">
          {onApprove && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onApprove(order)}
              className="text-green-600 border-green-600 hover:bg-green-50"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              Aprobar
            </Button>
          )}
          {onReject && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReject(order)}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Rechazar
            </Button>
          )}
        </div>
      )
    }
    
    if (order.status === 'Aprobado' && onCancel) {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCancel(order)}
          className="text-orange-600 border-orange-600 hover:bg-orange-50"
        >
          <XCircle className="w-4 h-4 mr-1" />
          Cancelar
        </Button>
      )
    }
    
    return null
  }

  const layout = {
    header: [
      {
        key: 'batchCode',
        label: 'Código de Lote',
        render: (value: string, order: ProductionOrderResponse) => (
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary-600" />
            <div>
              <p className="font-medium text-primary-900">{value}</p>
              <p className="text-xs text-primary-600">ID: {order.batchId}</p>
            </div>
          </div>
        )
      }
    ],
    content: [
      {
        key: 'productName',
        label: 'Producto',
        render: (value: string, order: ProductionOrderResponse) => (
          <div>
            <p className="font-medium text-primary-900">{value}</p>
            <p className="text-xs text-primary-600">{order.packagingName}</p>
          </div>
        )
      },
      {
        key: 'quantity',
        label: 'Cantidad',
        render: (value: number, order: ProductionOrderResponse) => (
          <span className="font-medium text-primary-900">
            {value} {getUnitLabel(order.unitMeasurement)}
          </span>
        )
      },
      {
        key: 'status',
        label: 'Estado',
        render: (value: ProductionOrderStatus) => getStatusBadge(value)
      },
      {
        key: 'plannedDate',
        label: 'Fecha Planificada',
        render: (value: string) => (
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-primary-600" />
            <span className="text-sm text-primary-700">
              {formatDate(value)}
            </span>
          </div>
        )
      }
    ],
    footer: [
      {
        key: 'actions',
        render: (value: any, order: ProductionOrderResponse) => (
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(order)}
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-1" />
              Ver Detalles
            </Button>
            {getStatusActions(order)}
          </div>
        )
      }
    ]
  }

  return (
    <DataCards
      data={orders}
      layout={layout}
      loading={isLoading}
    />
  )
}

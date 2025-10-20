"use client"

/**
 * Tarjetas de órdenes de producción siguiendo el diseño de order-card.tsx
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle, Clock, Calendar, Package, User } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"

interface OrdersCardsProps {
  orders: ProductionOrderResponse[]
  onView: (order: ProductionOrderResponse) => void
  onApprove?: (order: ProductionOrderResponse) => void
  onReject?: (order: ProductionOrderResponse) => void
  onCancel?: (order: ProductionOrderResponse) => void
  isLoading?: boolean
}

const statusStyles = {
  Pendiente: "bg-blue-100 text-blue-700 border-blue-300",
  Aprobado: "bg-green-100 text-green-700 border-green-300",
  Rechazado: "bg-red-100 text-red-700 border-red-300",
  Cancelada: "bg-gray-100 text-gray-700 border-gray-300",
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
      Pendiente: { 
        variant: "secondary" as const, 
        label: "Pendiente", 
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 border-yellow-300"
      },
      Aprobado: { 
        variant: "default" as const, 
        label: "Aprobado", 
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-300"
      },
      Rechazado: { 
        variant: "destructive" as const, 
        label: "Rechazado", 
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-300"
      },
      Cancelada: { 
        variant: "outline" as const, 
        label: "Cancelada", 
        icon: XCircle,
        className: "bg-gray-100 text-gray-800 border-gray-300"
      }
    }
    
    const config = statusConfig[status] || { 
      variant: "secondary" as const, 
      label: status, 
      icon: Clock,
      className: "bg-gray-100 text-gray-800 border-gray-300"
    }
    const Icon = config.icon
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${config.className}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="card p-6 border-2 border-primary-600 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes de producción</h3>
        <p className="text-gray-500">No se encontraron órdenes que coincidan con los filtros aplicados.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
      {orders.map((order) => (
        <div key={order.id} className="card p-6 border-2 border-primary-600 hover:shadow-md transition-all w-full">
          {/* Header con ID y badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-primary-900">{order.batchCode}</h3>
              {getStatusBadge(order.status)}
            </div>

            {/* Botones de acción */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                onClick={() => onView(order)}
                aria-label="Ver detalle"
              >
                <Eye className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tipo de cerveza */}
          <h4 className="text-xl font-semibold text-primary-900 mb-2">{order.productName}</h4>
          <p className="text-sm text-primary-600 mb-4">Empaque: {order.packagingName}</p>

          {/* Información de fechas */}
          <div className="grid grid-cols-1 gap-3 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-primary-600" />
              <span className="text-primary-800">
                Planificada: <span className="font-medium">{formatDate(order.plannedDate)}</span>
              </span>
            </div>
            {order.startDate && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary-600" />
                <span className="text-primary-800">
                  Inicio: <span className="font-medium">{formatDate(order.startDate)}</span>
                </span>
              </div>
            )}
            {order.estimatedCompletedDate && (
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-primary-600" />
                <span className="text-primary-800">
                  Fin estimado: <span className="font-medium">{formatDate(order.estimatedCompletedDate)}</span>
                </span>
              </div>
            )}
          </div>

          {/* Cantidad */}
          <div className="mb-4">
            <p className="text-sm text-primary-800">
              Cantidad: <span className="font-semibold text-primary-900">
                {order.quantity} {getUnitLabel(order.unitMeasurement)}
              </span>
            </p>
          </div>

          {/* Acciones */}
          <div className="flex flex-col gap-2">
            {getStatusActions(order)}
          </div>
        </div>
      ))}
    </div>
  )
}

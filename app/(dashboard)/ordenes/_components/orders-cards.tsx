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
  Pendiente: "bg-primary-100 text-primary-700 border-primary-300",
  Aprobado: "bg-green-100 text-green-700 border-green-300",
  Rechazado: "bg-red-100 text-red-700 border-red-300",
  Cancelada: "bg-primary-50 text-primary-700 border-primary-200",
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
      PENDIENTE: { 
        variant: "secondary" as const, 
        label: "Pendiente", 
        icon: Clock,
        className: "bg-yellow-100 text-yellow-800 border-yellow-300"
      },
      APROBADA: { 
        variant: "default" as const, 
        label: "Aprobada", 
        icon: CheckCircle,
        className: "bg-green-100 text-green-800 border-green-300"
      },
      RECHAZADA: { 
        variant: "destructive" as const, 
        label: "Rechazada", 
        icon: XCircle,
        className: "bg-red-100 text-red-800 border-red-300"
      },
      CANCELADA: { 
        variant: "outline" as const, 
        label: "Cancelada", 
        icon: XCircle,
        className: "bg-primary-50 text-primary-700 border-primary-200"
      }
    }
    
    const config = statusConfig[status] || { 
      variant: "secondary" as const, 
      label: status, 
      icon: Clock,
      className: "bg-primary-50 text-primary-700 border-primary-200"
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="card p-6 border-2 border-primary-600 animate-pulse">
            <div className="space-y-4">
              <div className="h-4 bg-primary-100 rounded w-3/4"></div>
              <div className="h-6 bg-primary-100 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-3 bg-primary-100 rounded w-full"></div>
                <div className="h-3 bg-primary-100 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="card border-2 border-primary-600 p-12 text-center">
        <Package className="w-12 h-12 text-primary-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-primary-900 mb-2">No hay órdenes de producción</h3>
        <p className="text-primary-600">No se encontraron órdenes que coincidan con los filtros aplicados.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="card p-6 border-2 border-primary-600 hover:shadow-md transition-all">
          {/* Header con ID, badges y acciones */}
          <div className="flex items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="text-lg font-semibold text-primary-900">{"ORD-"+order.batchId}</h3>
              {getStatusBadge(order.status)}
            </div>

            {/* Botón de vista en detalle */}
              <button
              className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600 flex-shrink-0"
                onClick={() => onView(order)}
                aria-label="Ver detalle"
              >
                <Eye className="w-5 h-5" />
              </button>
          </div>

          {/* Contenido principal - Layout responsive */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Información del producto y cantidad - Siempre visible */}
            <div className="md:col-span-4 lg:col-span-3 space-y-2">
              <h4 className="text-xl font-semibold text-primary-900">{order.productName}</h4>
              <p className="text-sm text-primary-600">Empaque: {order.packagingName}</p>
            <p className="text-sm text-primary-800">
              Cantidad: <span className="font-semibold text-primary-900">
                {order.quantity} {getUnitLabel(order.unitMeasurement)}
              </span>
            </p>
          </div>

            {/* Cronograma de fechas - Oculto en mobile, visible desde tablet */}
            <div className="hidden md:block md:col-span-8 lg:col-span-6 md:border-l md:border-stroke md:pl-6">
              <h5 className="text-xs font-semibold text-primary-700 uppercase mb-3">Cronograma</h5>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {/* Fecha Planificada - Siempre visible */}
                <div className="flex items-center gap-2 text-sm flex-shrink-0">
                  <Calendar className="w-4 h-4 text-primary-600" />
                  <div>
                    <p className="text-xs text-primary-600">Planificada</p>
                    <p className="font-medium text-primary-900 text-sm whitespace-nowrap">
                      {order.plannedDate ? formatDate(order.plannedDate) : '-'}
                    </p>
                  </div>
                </div>
                
                {/* Validación - Siempre visible */}
                <div className={cn(
                  "flex items-center gap-2 text-sm flex-shrink-0",
                  !order.validationDate && "opacity-40"
                )}>
                  <CheckCircle className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-primary-600">Validación</p>
                    <p className="font-medium text-primary-900 text-sm whitespace-nowrap">
                      {order.validationDate ? formatDate(order.validationDate) : 'Pendiente'}
                    </p>
                  </div>
                </div>
                
                {/* Inicio - Siempre visible */}
                <div className={cn(
                  "flex items-center gap-2 text-sm flex-shrink-0",
                  !order.startDate && "opacity-40"
                )}>
                  <Calendar className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-primary-600">Inicio</p>
                    <p className="font-medium text-primary-900 text-sm whitespace-nowrap">
                      {order.startDate ? formatDate(order.startDate) : 'Pendiente'}
                    </p>
                  </div>
                </div>
                
                {/* Fin estimado - Siempre visible */}
                <div className={cn(
                  "flex items-center gap-2 text-sm flex-shrink-0",
                  !order.estimatedCompletedDate && "opacity-40"
                )}>
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-primary-600">Fin estimado</p>
                    <p className="font-medium text-primary-900 text-sm whitespace-nowrap">
                      {order.estimatedCompletedDate ? formatDate(order.estimatedCompletedDate) : 'Por definir'}
                    </p>
                  </div>
                </div>
                
                {/* Completada - Siempre visible */}
                <div className={cn(
                  "flex items-center gap-2 text-sm flex-shrink-0",
                  !order.completedDate && "opacity-40"
                )}>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-xs text-primary-600">Completada</p>
                    <p className="font-medium text-primary-900 text-sm whitespace-nowrap">
                      {order.completedDate ? formatDate(order.completedDate) : 'Pendiente'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Información adicional - Solo pantallas grandes */}
            <div className="hidden lg:block lg:col-span-3 border-l border-stroke pl-6 space-y-3">
              <h5 className="text-xs font-semibold text-primary-700 uppercase mb-2">Detalles</h5>
              
              <div className="flex items-start gap-2 text-sm">
                <Package className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-primary-600">Código de lote</p>
                  <p className="font-medium text-primary-900 text-sm">{order.batchCode}</p>
                </div>
              </div>

              {order.status && (
                <div className="flex items-start gap-2 text-sm">
                  <User className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-primary-600">Responsable</p>
                    <p className="font-medium text-primary-900 text-sm">
                      {order.approvedByUserName || "A definir"}
                    </p>
                  </div>
                </div>
              )}
          </div>
          </div>

        </div>
      ))}
    </div>
  )
}

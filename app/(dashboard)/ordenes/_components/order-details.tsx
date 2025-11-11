"use client"

/**
 * Detalles de una orden de producción
 */

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Calendar, 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Factory
} from "lucide-react"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"

interface OrderDetailsProps {
  order: ProductionOrderResponse
  onApprove?: (order: ProductionOrderResponse) => void
  onReject?: (order: ProductionOrderResponse) => void
  onCancel?: (order: ProductionOrderResponse) => void
  onEdit?: (order: ProductionOrderResponse) => void
  onClose?: () => void
  isLoading?: boolean
}

export function OrderDetails({ 
  order, 
  onApprove, 
  onReject, 
  onCancel, 
  onEdit, 
  onClose,
  isLoading = false 
}: OrderDetailsProps) {
  const getStatusBadge = (status: ProductionOrderStatus) => {
    const statusConfig = {
      PENDIENTE: { 
        variant: "secondary" as const, 
        label: "Pendiente", 
        icon: Clock,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50"
      },
      APROBADA: { 
        variant: "default" as const, 
        label: "Aprobada", 
        icon: CheckCircle,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      RECHAZADA: { 
        variant: "destructive" as const, 
        label: "Rechazada", 
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50"
      },
      CANCELADA: { 
        variant: "outline" as const, 
        label: "Cancelada", 
        icon: XCircle,
        color: "text-primary-700",
        bgColor: "bg-primary-50"
      }
    }
    
    const config = statusConfig[status] || { variant: "secondary" as const, label: status, icon: Clock, color: "text-primary-700", bgColor: "bg-primary-50" }
    const Icon = config.icon
    
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${config.bgColor}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
        <span className={`font-medium ${config.color}`}>{config.label}</span>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "No definida"
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return "No definida"
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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

  const getStatusActions = () => {
    if (order.status === 'PENDIENTE') {
      return (
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {onApprove && (
            <Button
              onClick={() => onApprove(order)}
              className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto text-xs sm:text-sm"
              disabled={isLoading}
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-1.5 sm:mr-2" />
              <span>Aprobar</span>
            </Button>
          )}
          {onReject && (
            <Button
              variant="outline"
              onClick={() => onReject(order)}
              className="border-red-600 text-red-600 hover:bg-red-50 w-full sm:w-auto text-xs sm:text-sm"
              disabled={isLoading}
              size="sm"
            >
              <XCircle className="w-4 h-4 mr-1.5 sm:mr-2" />
              <span>Rechazar</span>
            </Button>
          )}
        </div>
      )
    }
    
    if (order.status === 'APROBADA' && onCancel) {
      return (
        <Button
          variant="outline"
          onClick={() => onCancel(order)}
          className="border-orange-600 text-orange-600 hover:bg-orange-50 w-full sm:w-auto text-xs sm:text-sm"
          disabled={isLoading}
          size="sm"
        >
          <XCircle className="w-4 h-4 mr-1.5 sm:mr-2" />
          <span>Cancelar Orden</span>
        </Button>
      )
    }
    
    return null
  }

  const getProgressInfo = () => {
    if (order.status === 'PENDIENTE') {
      return {
        message: "La orden está pendiente de aprobación",
        icon: Clock,
        color: "text-yellow-600"
      }
    }
    
    if (order.status === 'APROBADA') {
      return {
        message: "La orden ha sido aprobada y está lista para producción",
        icon: CheckCircle,
        color: "text-green-600"
      }
    }
    
    if (order.status === 'RECHAZADA') {
      return {
        message: "La orden ha sido rechazada",
        icon: XCircle,
        color: "text-red-600"
      }
    }
    
    if (order.status === 'CANCELADA') {
      return {
        message: "La orden ha sido cancelada",
        icon: XCircle,
        color: "text-primary-700"
      }
    }
    
    return null
  }

  const progressInfo = getProgressInfo()

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header con estado y acciones - Completamente responsive */}
      <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-4 bg-primary-50 rounded-lg">
        <div className="flex items-start gap-3">
          <Factory className="w-5 h-5 md:w-6 md:h-6 text-primary-600 flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-primary-900 truncate">
              Orden de Producción
            </h2>
            <p className="text-xs md:text-sm text-primary-600 truncate">
              {order.batchCode} • ID: {order.batchId}
            </p>
          </div>
        </div>
        {/* Estado y acciones en fila separada en móvil */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-shrink-0">
            {getStatusBadge(order.status)}
          </div>
          <div className="flex-1 sm:flex-initial">
            {getStatusActions()}
          </div>
        </div>
      </div>

      {/* Información de progreso */}
      {progressInfo && (
        <div className="flex items-center gap-3 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <progressInfo.icon className={`w-5 h-5 ${progressInfo.color}`} />
          <p className={`font-medium ${progressInfo.color}`}>
            {progressInfo.message}
          </p>
        </div>
      )}

      {/* Información del producto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
            <Package className="w-5 h-5" />
            Información del Producto
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-primary-700">Producto</label>
              <p className="text-lg font-medium text-primary-900">{order.productName}</p>
            </div>
            
            <div>
              <label className="text-sm text-primary-700">Empaque</label>
              <p className="text-lg font-medium text-primary-900">{order.packagingName}</p>
            </div>
            
            <div>
              <label className="text-sm text-primary-700">Cantidad</label>
              <p className="text-lg font-bold text-primary-900">
                {order.quantity} {getUnitLabel(order.unitMeasurement)}
              </p>
            </div>
          </div>
        </div>

        {/* Fechas importantes */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-900 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Cronograma
          </h3>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-primary-700">Fecha de Validación</label>
              <p className="text-sm font-medium text-primary-900">
                {formatDateTime(order.validationDate)}
              </p>
            </div>
            
            <div>
              <label className="text-sm text-primary-700">Fecha Planificada</label>
              <p className="text-sm font-medium text-primary-900">
                {formatDate(order.plannedDate)}
              </p>
            </div>
            
            {order.startDate && (
              <div>
                <label className="text-sm text-primary-700">Fecha de Inicio</label>
                <p className="text-sm font-medium text-primary-900">
                  {formatDate(order.startDate)}
                </p>
              </div>
            )}
            
            {order.estimatedCompletedDate && (
              <div>
                <label className="text-sm text-primary-700">Fecha Estimada de Finalización</label>
                <p className="text-sm font-medium text-primary-900">
                  {formatDate(order.estimatedCompletedDate)}
                </p>
              </div>
            )}
            
            {order.completedDate && (
              <div>
                <label className="text-sm text-primary-700">Fecha de Finalización</label>
                <p className="text-sm font-medium text-green-600">
                  {formatDate(order.completedDate)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="pt-4 border-t border-stroke">
        <h4 className="font-medium text-primary-900 mb-4">Información Adicional</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-primary-700">ID de Lote</label>
            <p className="text-sm font-medium text-primary-900">{order.batchId}</p>
          </div>
          <div>
            <label className="text-sm text-primary-700">Código de Lote</label>
            <p className="text-sm font-medium text-primary-900">{order.batchCode}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

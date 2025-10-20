"use client"

/**
 * Tabla de órdenes de producción
 */

import { useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit, CheckCircle, XCircle, Clock } from "lucide-react"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"

interface OrdersTableProps {
  orders: ProductionOrderResponse[]
  onView: (order: ProductionOrderResponse) => void
  onEdit?: (order: ProductionOrderResponse) => void
  onApprove?: (order: ProductionOrderResponse) => void
  onReject?: (order: ProductionOrderResponse) => void
  onCancel?: (order: ProductionOrderResponse) => void
  isLoading?: boolean
}

export function OrdersTable({ 
  orders, 
  onView, 
  onEdit, 
  onApprove, 
  onReject, 
  onCancel, 
  isLoading = false 
}: OrdersTableProps) {
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

  const columns = [
    {
      key: 'batchCode',
      label: 'Código de Lote',
      render: (value: string, order: ProductionOrderResponse) => (
        <div>
          <p className="font-medium text-primary-900">{value}</p>
          <p className="text-xs text-primary-600">ID: {order.batchId}</p>
        </div>
      )
    },
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
        <span className="text-sm text-primary-700">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'startDate',
      label: 'Fecha de Inicio',
      render: (value: string) => (
        <span className="text-sm text-primary-700">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'estimatedCompletedDate',
      label: 'Fecha Estimada',
      render: (value: string) => (
        <span className="text-sm text-primary-700">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Acciones',
      render: (value: any, order: ProductionOrderResponse) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(order)}
            className="h-8 w-8 p-0"
          >
            <Eye className="w-4 h-4" />
          </Button>
          
          {order.status === 'Pendiente' && (
            <>
              {onApprove && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onApprove(order)}
                  className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                </Button>
              )}
              {onReject && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onReject(order)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <XCircle className="w-4 h-4" />
                </Button>
              )}
            </>
          )}
          
          {order.status === 'Aprobado' && onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCancel(order)}
              className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <DataTable
      data={orders}
      columns={columns}
      loading={isLoading}
      emptyMessage="No hay órdenes de producción disponibles"
    />
  )
}

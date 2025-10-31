"use client"

/**
 * Componente cliente para manejar operaciones CRUD de órdenes de producción
 * Incluye modales para crear/editar y confirmaciones para acciones
 */

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { OrdersCards } from "./orders-cards"
import { OrderForm } from "./order-form"
import { OrderDetails } from "./order-details"
import { 
  approveProductionOrder, 
  rejectProductionOrder, 
  cancelProductionOrder 
} from "@/lib/production-orders-api"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { ProductionOrderResponse, ProductionOrderCreateRequest } from "@/types"

interface OrderClientProps {
  orders: ProductionOrderResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
  autoOpenId?: string
}

export function OrderClient({ orders, autoOpenId }: OrderClientProps) {
  const router = useRouter()
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrderResponse | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Auto-abrir modal si se proporciona autoOpenId
  useEffect(() => {
    if (autoOpenId && orders.length > 0) {
      const targetOrder = orders.find(o => o.id === autoOpenId)
      if (targetOrder) {
        handleViewDetails(targetOrder)
      }
    }
  }, [autoOpenId, orders])

  const handleApprove = async (order: ProductionOrderResponse) => {
    setIsLoading(true)
    try {
      await approveProductionOrder(order.id)
      router.refresh()
      setIsViewing(false)
      setSelectedOrder(null)
      showSuccess('Orden aprobada exitosamente')
    } catch (error) {
      handleError(error, {
        title: 'Error al aprobar orden'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReject = async (order: ProductionOrderResponse) => {
    setIsLoading(true)
    try {
      await rejectProductionOrder(order.id)
      router.refresh()
      setIsViewing(false)
      setSelectedOrder(null)
      showSuccess('Orden rechazada exitosamente')
    } catch (error) {
      handleError(error, {
        title: 'Error al rechazar orden'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async (order: ProductionOrderResponse) => {
    setIsLoading(true)
    try {
      await cancelProductionOrder(order.id)
      router.refresh()
      setIsViewing(false)
      setSelectedOrder(null)
      showSuccess('Orden cancelada exitosamente')
    } catch (error) {
      handleError(error, {
        title: 'Error al cancelar orden'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (order: ProductionOrderResponse) => {
    setSelectedOrder(order)
    setIsViewing(true)
  }

  const handleCreateClick = () => {
    setIsCreating(true)
  }

  return (
    <>
      <OrdersCards
        orders={orders}
        onView={handleViewDetails}
        onApprove={handleApprove}
        onReject={handleReject}
        onCancel={handleCancel}
        isLoading={isLoading}
      />

      {/* Modal para ver detalles */}
      {isViewing && selectedOrder && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-600">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary-900">Detalles de la Orden</h2>
                <button
                  onClick={() => {
                    setIsViewing(false)
                    setSelectedOrder(null)
                  }}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <OrderDetails
                order={selectedOrder}
                onApprove={handleApprove}
                onReject={handleReject}
                onCancel={handleCancel}
                onClose={() => {
                  setIsViewing(false)
                  setSelectedOrder(null)
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}


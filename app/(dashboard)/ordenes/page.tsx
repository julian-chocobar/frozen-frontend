"use client"

/**
 * Página de Planificación de Producción
 * Gestiona las órdenes de producción de cerveza
 */

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { useIsMobile } from "@/hooks/use-mobile"
import { getProductionOrders, approveProductionOrder, rejectProductionOrder, cancelProductionOrder } from "@/lib/production-orders-api"
import { OrdersTable } from "./_components/orders-table"
import { OrdersCards } from "./_components/orders-cards"
import { OrdersFilters } from "./_components/orders-filters"
import { OrderDetails } from "./_components/order-details"
import { OrderCreateButton } from "./_components/create-button"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"

export default function ProduccionPage() {
  const isMobile = useIsMobile()
  const [orders, setOrders] = useState<ProductionOrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrderResponse | null>(null)
  const [filters, setFilters] = useState<{
    status?: ProductionOrderStatus
    productId?: string
    startDate?: string
    endDate?: string
  }>({})
  const [pagination, setPagination] = useState({
    currentPage: 0,
    totalPages: 0,
    totalElements: 0
  })

  // Cargar órdenes
  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await getProductionOrders({
        page: 0,
        size: 50,
        ...filters
      })
      
      setOrders(response.productionOrders)
      setPagination({
        currentPage: response.pagination.currentPage,
        totalPages: response.pagination.totalPages,
        totalElements: response.pagination.totalElements
      })
    } catch (error) {
      console.error('Error cargando órdenes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [filters])

  // Manejar filtros
  const handleFiltersChange = (newFilters: {
    status?: ProductionOrderStatus
    productId?: string
    startDate?: string
    endDate?: string
  }) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  // Manejar acciones
  const handleViewOrder = (order: ProductionOrderResponse) => {
    setSelectedOrder(order)
    setShowDetails(true)
  }

  const handleEditOrder = (order: ProductionOrderResponse) => {
    setSelectedOrder(order)
    // TODO: Implementar edición de órdenes si es necesario
  }

  const handleApproveOrder = async (order: ProductionOrderResponse) => {
    try {
      await approveProductionOrder(order.id)
      await loadOrders()
      setShowDetails(false)
    } catch (error) {
      console.error('Error aprobando orden:', error)
    }
  }

  const handleRejectOrder = async (order: ProductionOrderResponse) => {
    try {
      await rejectProductionOrder(order.id)
      await loadOrders()
      setShowDetails(false)
    } catch (error) {
      console.error('Error rechazando orden:', error)
    }
  }

  const handleCancelOrder = async (order: ProductionOrderResponse) => {
    try {
      await cancelProductionOrder(order.id)
      await loadOrders()
      setShowDetails(false)
    } catch (error) {
      console.error('Error cancelando orden:', error)
    }
  }


  // Calcular estadísticas
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pendiente').length,
    approved: orders.filter(o => o.status === 'Aprobado').length,
    completed: orders.filter(o => o.status === 'Aprobado').length, // Asumiendo que aprobado = completado
    totalQuantity: orders.reduce((sum, order) => sum + order.quantity, 0)
  }

  return (
    <>
      <Header
        title="Planificación de Producción"
        subtitle="Gestiona las órdenes de producción de cerveza"
        notificationCount={stats.pending}
        actionButton={<OrderCreateButton />}
      />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            title="Total de Órdenes" 
            value={stats.total.toString()} 
            subtitle="Todas las órdenes" 
            variant="primary" 
          />
          <StatCard 
            title="Pendientes" 
            value={stats.pending.toString()} 
            subtitle="Esperando aprobación" 
            variant="default" 
          />
          <StatCard 
            title="Aprobadas" 
            value={stats.approved.toString()} 
            subtitle="Listas para producción" 
            variant="default" 
          />
          <StatCard 
            title="Cantidad Total" 
            value={stats.totalQuantity.toString()} 
            subtitle="Unidades planificadas" 
            variant="primary" 
          />
        </div>

        {/* Filtros */}
        <OrdersFilters
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
          isLoading={loading}
        />

        {/* Lista de órdenes */}
        <div className="card p-6 border-2 border-primary-600">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-primary-900 mb-2">
              Órdenes de Producción
            </h2>
            <p className="text-sm text-primary-600">
              {stats.total} órdenes encontradas
            </p>
          </div>

          {isMobile ? (
            <OrdersCards
              orders={orders}
              onView={handleViewOrder}
              onApprove={handleApproveOrder}
              onReject={handleRejectOrder}
              onCancel={handleCancelOrder}
              isLoading={loading}
            />
          ) : (
            <OrdersTable
              orders={orders}
              onView={handleViewOrder}
              onApprove={handleApproveOrder}
              onReject={handleRejectOrder}
              onCancel={handleCancelOrder}
              isLoading={loading}
            />
          )}
        </div>
      </div>

      {/* Modal de detalles */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl">
          <DialogTitle className="text-xl font-semibold text-primary-900 mb-4">
            Detalles de la Orden
          </DialogTitle>
          {selectedOrder && (
            <OrderDetails
              order={selectedOrder}
              onApprove={handleApproveOrder}
              onReject={handleRejectOrder}
              onCancel={handleCancelOrder}
              isLoading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

    </>
  )
}

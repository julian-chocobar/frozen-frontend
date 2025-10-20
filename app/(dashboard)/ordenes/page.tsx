/**
 * Página de Planificación de Producción
 * Gestiona las órdenes de producción de cerveza
 */

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { useIsMobile } from "@/hooks/use-mobile"
import { getProductionOrders } from "@/lib/production-orders-api"
import { OrderClient } from "./_components/order-client"
import { OrdersFilters } from "./_components/orders-filters"
import { OrderCreateButton } from "./_components/create-button"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { PaginationClient } from "@/components/ui/pagination-client"

interface OrdenesPageProps {
  searchParams: Promise<{
    page?: string
    size?: string
    status?: ProductionOrderStatus
    productId?: string
  }>
}

export default async function OrdenesPage({ searchParams }: OrdenesPageProps) {
  const params = await searchParams
  const page = parseInt(params.page || '0')
  const status = params.status
  const productId = params.productId
  let ordersData
  let error: string | null = null

  try {
    ordersData = await getProductionOrders({
      page,
      size: 10,
      status,
      productId
    })
  } catch (err) {
    console.error('Error cargando órdenes:', err)
    if (err instanceof Error) {
      if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
        error = 'No se pudo conectar con el backend'
      } else {
        error = err.message
      }
    } else {
      error = 'No se pudieron cargar las órdenes'
    }
  }

  // Calcular estadísticas
  const stats = {
    total: ordersData?.productionOrders?.length || 0,
    pending: ordersData?.productionOrders?.filter(o => o.status === 'Pendiente').length || 0,
    approved: ordersData?.productionOrders?.filter(o => o.status === 'Aprobado').length || 0,
    rejected: ordersData?.productionOrders?.filter(o => o.status === 'Rechazado').length || 0,
    cancelled: ordersData?.productionOrders?.filter(o => o.status === 'Cancelada').length || 0,
    totalQuantity: ordersData?.productionOrders?.reduce((sum, order) => sum + order.quantity, 0) || 0
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
            title="Rechazadas" 
            value={stats.rejected.toString()} 
            subtitle="No listadas para producción" 
            variant="default" 
          />
          <StatCard 
            title="Canceladas" 
            value={stats.cancelled.toString()} 
            subtitle="No listadas para producción" 
            variant="default" 
          />
          <StatCard 
            title="Cantidad Total" 
            value={stats.totalQuantity.toString()} 
            subtitle="Unidades planificadas" 
            variant="default" 
          />
        </div>

        <div className="p-4 md:p-6 space-y-6">
        {/* Filtros */}
        <OrdersFilters />
  
        <div className="card border-2 border-primary-600 overflow-hidden">
          <div className="p-6 border-b border-stroke">
            <h2 className="text-xl font-semibold text-primary-900 mb-1">Órdenes de Producción</h2>
            <p className="text-sm text-primary-600">Gestiona las órdenes de producción de cerveza</p>
          </div>

          {error ? (
            <ErrorState error={error} />
          ) : ordersData ? (
          <OrderClient
            orders={ordersData.productionOrders}
            pagination={ordersData.pagination}
          />
          ) : (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-primary-600">Cargando órdenes...</p>
            </div>
          )}
          </div>

          {/* Contador de resultados y paginación */}
          {ordersData && (
            <div className="text-center space-y-4">
              <p className="text-sm text-primary-700">
                Mostrando {ordersData.productionOrders.length} órdenes de {ordersData.pagination.totalElements} totales
              </p>

              {/* Paginación funcional */}
              <PaginationClient 
                currentPage={ordersData.pagination.currentPage}
                totalPages={ordersData.pagination.totalPages}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

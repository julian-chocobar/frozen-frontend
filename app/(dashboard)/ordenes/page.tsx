'use client';

/**
 * Página de Planificación de Producción
 * Gestiona las órdenes de producción de cerveza
 */

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatsCarousel } from "@/components/ui/stats-carousel"
import { getProductionOrders } from "@/lib/orders"
import { calculateOrderStats } from "@/lib/orders/utils"
import { OrderClient } from "./_components/order-client"
import { OrdersFilters } from "./_components/orders-filters"
import { OrderCreateButton } from "./_components/create-button"
import { OrdersLoadingState } from "@/components/orders/orders-loading-state"
import { OrdersErrorState } from "@/components/orders/orders-error-state"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"
import { 
  ORDER_PAGINATION,
  ORDER_ERROR_MESSAGES 
} from "@/lib/constants"
import { ClipboardList, Clock, CheckCircle, XCircle, Ban, Package2 } from "lucide-react"
import { useSearchParams } from 'next/navigation'

// Tipo para los datos de la página
interface OrdersPageData {
  productionOrders: ProductionOrderResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

export default function OrdenesPage() {
  const searchParams = useSearchParams()
  const [ordersData, setOrdersData] = useState<OrdersPageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)

  // Obtener parámetros de búsqueda
  const page = parseInt(searchParams.get('page') || '0')
  const status = searchParams.get('status') as ProductionOrderStatus | undefined
  const productId = searchParams.get('productId') || undefined
  const autoOpenId = searchParams.get('id') || undefined

  /**
   * Callback para forzar recarga de datos
   */
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // Escuchar cambios de navegación para forzar refresh
  useEffect(() => {
    window.addEventListener('focus', handleRefresh)
    return () => window.removeEventListener('focus', handleRefresh)
  }, [handleRefresh])

  /**
   * Cargar órdenes desde la API
   */
  const loadOrders = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getProductionOrders({
        page,
        size: ORDER_PAGINATION.DEFAULT_SIZE,
        status,
        productId
      })
      setOrdersData(data)
    } catch (err) {
      console.error('Error cargando órdenes:', err)
      if (err instanceof Error) {
        if (err.message.includes('conectar con el backend') || 
            err.message.includes('ECONNREFUSED') || 
            err.message.includes('fetch failed')) {
          setError(ORDER_ERROR_MESSAGES.CONNECTION_ERROR)
        } else {
          setError(err.message)
        }
      } else {
        setError(ORDER_ERROR_MESSAGES.LOAD_FAILED)
      }
    } finally {
      setLoading(false)
    }
  }, [page, status, productId])

  // Cargar datos cuando cambien los parámetros o refreshKey
  useEffect(() => {
    loadOrders()
  }, [loadOrders, refreshKey])

  /**
   * Calcular estadísticas de órdenes memoizadas
   */
  const stats = useMemo(() => {
    if (!ordersData?.productionOrders) {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        cancelled: 0,
        totalQuantity: 0
      }
    }
    return calculateOrderStats(ordersData.productionOrders)
  }, [ordersData?.productionOrders])

  return (
    <>
      <Header
        title="Planificación de Producción"
        subtitle="Gestiona las órdenes de producción de cerveza"
      />
      <div className="p-4 md:p-6 space-y-6 text-primary-900">
        {/* Tarjetas de estadísticas - Carrusel horizontal */}
        <div className="w-full" data-tour="orders-stats">
          <StatsCarousel>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Total de Órdenes" 
              value={stats.total.toString()} 
              subtitle="Todas las órdenes" 
              icon={ClipboardList}
              variant="primary" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Pendientes" 
              value={stats.pending.toString()} 
              subtitle="Esperando aprobación" 
              icon={Clock}
              variant="default" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Aprobadas" 
              value={stats.approved.toString()} 
              subtitle="Listas para producción" 
              icon={CheckCircle}
              variant="success" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Rechazadas" 
              value={stats.rejected.toString()} 
              subtitle="No listadas para producción" 
              icon={XCircle}
              variant="alert" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Canceladas" 
              value={stats.cancelled.toString()} 
              subtitle="No listadas para producción" 
              icon={Ban}
              variant="default" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Cantidad Total" 
              value={stats.totalQuantity.toString()} 
              subtitle="Unidades planificadas" 
              icon={Package2}
              variant="default" 
            />
          </div>
        </StatsCarousel>
        </div>

        {/* Recuadro con título, filtros y botón de nueva orden */}
        <div className="card border-2 border-primary-600 p-6 overflow-hidden mb-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4" data-tour="orders-header">
            {/* Título y subtítulo */}
            <div className="flex-shrink-0 min-w-0">
              <h2 className="text-xl font-semibold text-primary-900 mb-1">Órdenes de Producción</h2>
              <p className="text-sm text-primary-600">Listado de todas las órdenes planificadas y en proceso</p>
            </div>
            
            {/* Contenedor para filtros y botón - alineados horizontalmente */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto xl:ml-auto ">
              {/* Filtros */}
              <div className="flex-shrink-0 w-full sm:w-auto" data-tour="orders-filters">
                <OrdersFilters />
              </div>

              {/* Botón de Nueva Orden */}
              <div className="flex-shrink-0 w-full sm:w-auto sm:self-center" data-tour="orders-create">
                <OrderCreateButton onCreateCallback={handleRefresh} />
              </div>
            </div>
          </div>
        </div>

        {/* Contenido principal */}
        {error ? (
          <OrdersErrorState 
            error={error}
            onRetry={loadOrders}
          />
        ) : loading ? (
          <OrdersLoadingState count={6} />
        ) : ordersData && ordersData.productionOrders.length > 0 ? (
          <div className="w-full" data-tour="orders-table">
            <OrderClient
              orders={ordersData.productionOrders}
              pagination={ordersData.pagination}
              autoOpenId={autoOpenId}
              onRefresh={handleRefresh}
            />
          </div>
        ) : (
          <div className="card border-2 border-primary-600 p-8">
            <p className="text-center text-primary-600">No hay órdenes para mostrar</p>
          </div>
        )}
      </div>
    </>
  )
}
'use client';

/**
 * Página de Planificación de Producción
 * Gestiona las órdenes de producción de cerveza
 */

import { useState, useEffect } from 'react'
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatsCarousel } from "@/components/ui/stats-carousel"
import { useIsMobile } from "@/hooks/use-mobile"
import { getProductionOrders } from "@/lib/production-orders-api"
import { OrderClient } from "./_components/order-client"
import { OrdersFilters } from "./_components/orders-filters"
import { OrderCreateButton } from "./_components/create-button"
import type { ProductionOrderResponse, ProductionOrderStatus } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { PaginationClient } from "@/components/ui/pagination-client"
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
  const autoOpenId = searchParams.get('id') || undefined // Para abrir modal automáticamente

  // Escuchar cambios de navegación para forzar refresh
  useEffect(() => {
    const handleFocus = () => {
      setRefreshKey(prev => prev + 1)
    }
    
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Cargar datos cuando cambien los parámetros o refreshKey
  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getProductionOrders({
          page,
          size: 10,
          status,
          productId
        })
        setOrdersData(data)
      } catch (err) {
        console.error('Error cargando órdenes:', err)
        if (err instanceof Error) {
          if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
            setError('No se pudo conectar con el backend')
          } else {
            setError(err.message)
          }
        } else {
          setError('No se pudieron cargar las órdenes')
        }
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
  }, [page, status, productId, refreshKey])

  // Calcular estadísticas
  const stats = {
    total: ordersData?.productionOrders?.length || 0,
    pending: ordersData?.productionOrders?.filter(o => o.status === 'PENDIENTE').length || 0,
    approved: ordersData?.productionOrders?.filter(o => o.status === 'APROBADA').length || 0,
    rejected: ordersData?.productionOrders?.filter(o => o.status === 'RECHAZADA').length || 0,
    cancelled: ordersData?.productionOrders?.filter(o => o.status === 'CANCELADA').length || 0,
    totalQuantity: ordersData?.productionOrders?.reduce((sum, order) => sum + order.quantity, 0) || 0
  }

  return (
    <>
      <Header
        title="Planificación de Producción"
        subtitle="Gestiona las órdenes de producción de cerveza"
      />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* Tarjetas de estadísticas - Carrusel horizontal */}
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

        {/* Recuadro con título, filtros y botón de nueva orden */}
        <div className="card border-2 border-primary-600 p-6 overflow-hidden">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            {/* Título y subtítulo */}
            <div className="flex-shrink-0 min-w-0">
              <h2 className="text-xl font-semibold text-primary-900 mb-1">Órdenes de Producción</h2>
              <p className="text-sm text-primary-600">Listado de todas las órdenes planificadas y en proceso</p>
            </div>
            
            {/* Contenedor para filtros y botón - alineados horizontalmente */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto xl:ml-auto ">
              {/* Filtros */}
              <div className="flex-shrink-0 w-full sm:w-auto">
                <OrdersFilters />
              </div>

              {/* Botón de Nueva Orden - Siempre visible */}
              <div className="flex-shrink-0 w-full sm:w-auto sm:self-center">
                <OrderCreateButton onCreateCallback={() => setRefreshKey(prev => prev + 1)} />
                
              </div>
            
            </div>
          </div>
        </div>

        {/* Tarjetas de órdenes */}
        {error ? (
          <div className="card border-2 border-primary-600">
            <ErrorState error={error} />
          </div>
        ) : loading ? (
          <div className="card border-2 border-primary-600 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-primary-600">Cargando órdenes...</p>
          </div>
        ) : ordersData ? (
          <>
            <OrderClient
              orders={ordersData.productionOrders}
              pagination={ordersData.pagination}
              autoOpenId={autoOpenId}
            />
            
            {/* Contador de resultados y paginación */}
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
          </>
        ) : null}
      </div>
    </>
  )
}
/**
 * Página principal - Dashboard
 * Muestra estadísticas generales, gráficos y alertas usando datos reales del backend
 */

'use client'

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/header"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatsCarousel } from "@/components/ui/stats-carousel"
import { InventoryChart } from "@/components/dashboard/inventory-chart"
import { UsageTrendsChart } from "@/components/dashboard/usage-trends-chart"
import { WasteChart } from "@/components/dashboard/waste-chart"
import { Package, TrendingUp, AlertTriangle, Beaker, XCircle, Box, BarChart3 } from "lucide-react"
import { analyticsApi } from "@/lib/analytics-api"
import { DashboardStatsDTO } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const dashboardStats = await analyticsApi.getDashboardMonthly()
        setStats(dashboardStats)
      } catch (err) {
        console.error('Error cargando estadísticas del dashboard:', err)
        setError('No se pudieron cargar las estadísticas del dashboard')
      } finally {
        setLoading(false)
      }
    }
    loadDashboardStats()
  }, [])

  if (loading) {
    return (
      <>
        <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
        <div className="p-4 md:p-6 space-y-6 text-primary-900">
          <div className="text-center py-12">
            <p className="text-primary-600">Cargando estadísticas...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
        <div className="p-4 md:p-6 space-y-6 text-primary-900">
          <ErrorState message={error} />
        </div>
      </>
    )
  }

  if (!stats) {
    return (
      <>
        <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
        <div className="p-4 md:p-6 space-y-6 text-primary-900">
          <div className="text-center py-12">
            <p className="text-primary-600">No hay datos disponibles</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
      <div className="p-4 md:p-6 space-y-6 text-primary-900">
        {/* Tarjetas de estadísticas principales */}
        <StatsCarousel>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Lotes en Progreso" 
              value={stats.batchesInProgress || 0} 
              subtitle="En producción" 
              icon={Beaker} 
              variant="primary" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Lotes Completados" 
              value={stats.batchesCompleted || 0} 
              subtitle="Este mes" 
              icon={TrendingUp} 
              variant="success" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard
              title="Lotes Cancelados"
              value={stats.batchesCancelled || 0}
              subtitle="Este mes"
              icon={XCircle}
              variant="alert"
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Total Producido" 
              value={`${(stats.totalProduced || 0).toFixed(2)}L`} 
              subtitle="Este mes" 
              icon={Package} 
              variant="default" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Desperdicios" 
              value={`${(stats.totalWaste || 0).toFixed(2)}L`} 
              subtitle="Total del mes" 
              icon={AlertTriangle} 
              variant="alert" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Materiales Usados" 
              value={`${(stats.totalMaterialsUsed || 0).toFixed(2)} kg`} 
              subtitle="Este mes" 
              icon={Box} 
              variant="default" 
            />
          </div>
          {stats.ordersRejected > 0 && (
            <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
              <StatCard 
                title="Órdenes Rechazadas" 
                value={stats.ordersRejected} 
                subtitle="Este mes" 
                icon={XCircle} 
                variant="alert" 
              />
            </div>
          )}
        </StatsCarousel>

        {/* Gráficos organizados en pestañas */}
        <div className="card border-2 border-primary-600 p-6">
          <Tabs defaultValue="production" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6 bg-primary-50 border border-primary-200">
              <TabsTrigger 
                value="production" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-700"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Producción</span>
                <span className="sm:hidden">Prod.</span>
              </TabsTrigger>
              <TabsTrigger 
                value="consumption" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-700"
              >
                <Box className="w-4 h-4" />
                <span className="hidden sm:inline">Consumo</span>
                <span className="sm:hidden">Cons.</span>
              </TabsTrigger>
              <TabsTrigger 
                value="waste" 
                className="flex items-center justify-center gap-2 data-[state=active]:bg-primary-600 data-[state=active]:text-white text-primary-700"
              >
                <AlertTriangle className="w-4 h-4" />
                <span className="hidden sm:inline">Desperdicios</span>
                <span className="sm:hidden">Desp.</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="production" className="mt-0">
              <InventoryChart />
            </TabsContent>

            <TabsContent value="consumption" className="mt-0">
              <UsageTrendsChart />
            </TabsContent>

            <TabsContent value="waste" className="mt-0">
              <WasteChart />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}

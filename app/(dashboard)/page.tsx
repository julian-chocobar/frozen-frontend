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
import { Package, TrendingUp, AlertTriangle, Beaker, XCircle, Box, BarChart3, LayoutGrid, List, SquareStack } from "lucide-react"
import { analyticsApi } from "@/lib/analytics"
import { DashboardStatsDTO } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { handleError } from "@/lib/error-handler"

type ViewMode = "tabs" | "grid" | "list"

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStatsDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>("grid")

  useEffect(() => {
    const loadDashboardStats = async () => {
      setLoading(true)
      setError(null)
      try {
        const dashboardStats = await analyticsApi.getDashboardMonthly()
        setStats(dashboardStats)
      } catch (err) {
        const errorInfo = handleError(err, {
          title: 'Error al cargar estadísticas',
          description: 'No se pudieron cargar las estadísticas del dashboard',
          showToast: false, // No mostrar toast, solo actualizar estado
          logToConsole: true,
        })
        setError(errorInfo.message)
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
        <div className="p-4 md:p-6 space-y-6">
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-primary-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
            </div>
            <p className="text-primary-600 font-medium">Cargando estadísticas...</p>
          </div>
        </div>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
        <div className="p-4 md:p-6 space-y-6">
          <ErrorState error={error} />
        </div>
      </>
    )
  }

  if (!stats) {
    return (
      <>
        <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
        <div className="p-4 md:p-6 space-y-6">
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <BarChart3 className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-primary-600 font-medium">No hay datos disponibles</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Dashboard" subtitle="Monitorea tu producción en tiempo real" />
      <div className="p-4 md:p-6 space-y-6">
          {/* Tarjetas de estadísticas principales */}
          <div className="mb-8" data-tour="dashboard-stats">
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
          </div>

          {/* Gráficos con selector de vista */}
          <div className="space-y-4" data-tour="dashboard-charts">
            {/* Selector de vista */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary-900">Análisis de Datos</h2>
              <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1.5 border border-gray-200/50 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                    viewMode === "grid"
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-primary-700 hover:bg-gray-100"
                  )}
                  title="Vista de cuadrícula"
                  >
                  <LayoutGrid className="w-4 h-4" />
                  <span className="hidden sm:inline">Cuadrícula</span>
                </button>
                <button
                  onClick={() => setViewMode("tabs")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                    viewMode === "tabs"
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-primary-700 hover:bg-gray-100"
                  )}
                  title="Vista de pestañas"
                >
                  <SquareStack className="w-4 h-4" />
                  <span className="hidden sm:inline">Pestañas</span>
                </button>
                
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200",
                    viewMode === "list"
                      ? "bg-primary-600 text-white shadow-md"
                      : "text-primary-700 hover:bg-gray-100"
                  )}
                  title="Vista de lista"
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">Lista</span>
                </button>
              </div>
            </div>

            {/* Vista de Pestañas */}
            {viewMode === "tabs" && (
              <div className="card border-2 border-primary-200/60 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
                <Tabs defaultValue="production" className="w-full">
                  <div className="p-6 pb-0">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger 
                        value="production"
                        className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-900 data-[state=active]:border-blue-200 text-primary-600 border border-transparent"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Producción</span>
                        <span className="sm:hidden">Prod.</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="consumption"
                        className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-900 data-[state=active]:border-orange-200 text-primary-600 border border-transparent"
                      >
                        <Box className="w-4 h-4" />
                        <span className="hidden sm:inline">Consumo</span>
                        <span className="sm:hidden">Cons.</span>
                      </TabsTrigger>
                      <TabsTrigger 
                        value="waste"
                        className="data-[state=active]:bg-red-50 data-[state=active]:text-red-900 data-[state=active]:border-red-200 text-primary-600 border border-transparent"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        <span className="hidden sm:inline">Desperdicios</span>
                        <span className="sm:hidden">Desp.</span>
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="production" className="mt-0">
                    <div className="bg-blue-50/50">
                      <InventoryChart />
                    </div>
                  </TabsContent>

                  <TabsContent value="consumption" className="mt-0">
                    <div className="bg-orange-50/50">
                      <UsageTrendsChart />
                    </div>
                  </TabsContent>

                  <TabsContent value="waste" className="mt-0">
                    <div className="bg-red-50/50">
                      <WasteChart />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Vista de Cuadrícula */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="card border-2 border-blue-200 bg-blue-50/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="p-4 border-b border-blue-200/60">
                    <div className="flex items-center gap-2 text-blue-900">
                      <BarChart3 className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Producción</h3>
                    </div>
                  </div>
                  <div className="bg-blue-50/50">
                    <InventoryChart />
                  </div>
                </div>
                <div className="card border-2 border-orange-200 bg-orange-50/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="p-4 border-b border-orange-200/60">
                    <div className="flex items-center gap-2 text-orange-900">
                      <Box className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Consumo</h3>
                    </div>
                  </div>
                  <div className="bg-orange-50/50">
                    <UsageTrendsChart />
                  </div>
                </div>
                <div className="card border-2 border-red-200 bg-red-50/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl lg:col-span-2">
                  <div className="p-4 border-b border-red-200/60">
                    <div className="flex items-center gap-2 text-red-900">
                      <AlertTriangle className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Desperdicios</h3>
                    </div>
                  </div>
                  <div className="bg-red-50/50">
                    <WasteChart />
                  </div>
                </div>
              </div>
            )}

            {/* Vista de Lista */}
            {viewMode === "list" && (
              <div className="space-y-6">
                <div className="card border-2 border-blue-200 bg-blue-50/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="p-4 border-b border-blue-200/60">
                    <div className="flex items-center gap-2 text-blue-900">
                      <BarChart3 className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Producción</h3>
                    </div>
                  </div>
                  <div className="bg-blue-50/50">
                    <InventoryChart />
                  </div>
                </div>
                <div className="card border-2 border-orange-200 bg-orange-50/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="p-4 border-b border-orange-200/60">
                    <div className="flex items-center gap-2 text-orange-900">
                      <Box className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Consumo</h3>
                    </div>
                  </div>
                  <div className="bg-orange-50/50">
                    <UsageTrendsChart />
                  </div>
                </div>
                <div className="card border-2 border-red-200 bg-red-50/80 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
                  <div className="p-4 border-b border-red-200/60">
                    <div className="flex items-center gap-2 text-red-900">
                      <AlertTriangle className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Desperdicios</h3>
                    </div>
                  </div>
                  <div className="bg-red-50/50">
                    <WasteChart />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </>
    )
  }

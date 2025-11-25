"use client"

/**
 * Componente EfficiencyChart - Gráfico de eficiencia mensual
 * 
 * Muestra la eficiencia mensual usando datos reales del backend con filtros.
 * Incluye visualización en gráficos de líneas y barras, filtros por producto, fechas y fase,
 * y estadísticas del total del período.
 * 
 * @example
 * ```tsx
 * <EfficiencyChart />
 * ```
 * 
 * @remarks
 * Este componente utiliza el hook `useChartData` para cargar datos del backend
 * y Recharts para renderizar gráficos interactivos. Los datos se pueden filtrar
 * por producto, rango de fechas y fase.
 */
import { useState, useMemo, useCallback } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { TrendingUp } from "lucide-react"
import { analyticsApi } from "@/lib/analytics"
import { MonthlyTotalDTO } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { AnalyticsFilters, AnalyticsFiltersState } from "./analytics-filters"
import { ProductSearchFilter } from "@/app/(dashboard)/ordenes/_components/product-search-filter"
import { cn, formatMonthLabel, sortMonthlyData } from "@/lib/utils"
import { ChartLoadingState } from "./chart-loading-state"
import { ChartEmptyState } from "./chart-empty-state"
import { ChartTooltip } from "./chart-tooltip"
import { useChartData } from "@/hooks/use-chart-data"

type ChartType = "bar" | "line"

export function EfficiencyChart() {
  const [filters, setFilters] = useState<AnalyticsFiltersState>({})
  const [productId, setProductId] = useState<string>("")
  const [phase, setPhase] = useState<string>("")
  const [chartType, setChartType] = useState<ChartType>("line")

  // Memoizar filtros adicionales para evitar recreaciones innecesarias
  const additionalFilters = useMemo(() => ({
    phase: phase || filters.phase || undefined,
  }), [phase, filters.phase])

  // Usar hook personalizado para carga de datos
  const { data, loading, error, reload } = useChartData({
    loadFunction: analyticsApi.getMonthlyEfficiency,
    filters,
    additionalFilterId: productId,
    additionalFilterKey: 'productId',
    additionalFilters,
    errorMessage: 'No se pudo cargar la eficiencia mensual',
  })

  const handleFiltersChange = useCallback((newFilters: AnalyticsFiltersState) => {
    // Solo actualizar si hay valores reales, no valores vacíos por defecto
    // Esto evita que se resetee el componente hijo cuando se inicializa
    if (newFilters.preset || newFilters.startDate || newFilters.endDate) {
      setFilters(newFilters)
      if (newFilters.productId !== undefined) {
        setProductId(newFilters.productId)
      }
      if (newFilters.phase !== undefined) {
        setPhase(newFilters.phase)
      }
    }
  }, [])

  const handleSearch = useCallback((searchFilters: AnalyticsFiltersState) => {
    setFilters({
      ...searchFilters,
      productId: productId || searchFilters.productId || undefined,
      phase: phase || searchFilters.phase || undefined,
    })
    reload()
  }, [productId, phase, reload])

  const handleClear = useCallback(() => {
    setProductId("")
    setPhase("")
    reload()
  }, [reload])

  // Calcular total y formatear datos para el gráfico usando useMemo
  const sortedData = useMemo(() => sortMonthlyData(data), [data])
  
  const total = useMemo(() => {
    if (data.length === 0) return 0
    const sum = data.reduce((sum, item) => sum + (item.total || 0), 0)
    return sum / data.length // Promedio de los porcentajes
  }, [data])

  const chartData = useMemo(
    () => sortedData.map(item => ({
      name: formatMonthLabel(item),
      value: item.total || 0,
      fullValue: item.total || 0,
    })),
    [sortedData]
  )

  if (loading) {
    return <ChartLoadingState color="blue" />
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorState error={error} />
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          {data.length > 0 ? (
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-3xl font-bold text-primary-900 font-mono">{total.toFixed(2)}%</p>
                <span className="text-sm font-medium text-primary-600">Total del período</span>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-lg font-medium text-primary-600">No hay datos disponibles</p>
              </div>
            </div>
          )}
          
          {/* Selector de tipo de gráfico */}
          {data.length > 0 && (
            <div className="flex gap-2" data-tour="dashboard-chart-type-selector">
              <button
                onClick={() => setChartType("line")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm",
                  chartType === "line"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-primary-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                )}
              >
                Líneas
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm",
                  chartType === "bar"
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-primary-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                )}
              >
                Barras
              </button>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="space-y-3">
          <AnalyticsFilters
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            onClear={handleClear}
            showProductFilter={true}
            showPhaseFilter={true}
            productFilterComponent={
              <ProductSearchFilter
                value={productId}
                onChange={setProductId}
                placeholder="Buscar producto..."
              />
            }
            currentProductId={productId}
          />
        </div>
      </div>

      {data.length === 0 ? (
        <ChartEmptyState icon={TrendingUp} message="No hay datos disponibles" />
      ) : (
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "bar" ? (
            <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 11 }}
                stroke="rgba(0, 0, 0, 0.1)"
              />
              <YAxis 
                tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 11 }}
                stroke="rgba(0, 0, 0, 0.1)"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<ChartTooltip unit="%" labelText="Eficiencia" color="#22c55e" />} />
              <Bar 
                dataKey="value" 
                fill="#22c55e"
                radius={[8, 8, 0, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          ) : (
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 0, 0, 0.05)" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 11 }}
                stroke="rgba(0, 0, 0, 0.1)"
              />
              <YAxis 
                tick={{ fill: 'rgba(0, 0, 0, 0.6)', fontSize: 11 }}
                stroke="rgba(0, 0, 0, 0.1)"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip content={<ChartTooltip unit="%" labelText="Eficiencia" color="#22c55e" />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#22c55e" 
                strokeWidth={3}
                fill="#22c55e"
                fillOpacity={0.1}
                dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}


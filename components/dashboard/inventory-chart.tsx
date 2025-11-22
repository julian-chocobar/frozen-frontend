"use client"

/**
 * Componente InventoryChart - Gráfico de producción mensual
 * 
 * Muestra la producción mensual usando datos reales del backend con filtros.
 * Incluye visualización en gráficos de líneas y barras, filtros por producto y fechas,
 * y estadísticas del total del período.
 * 
 * @example
 * ```tsx
 * <InventoryChart />
 * ```
 * 
 * @remarks
 * Este componente utiliza el hook `useChartData` para cargar datos del backend
 * y Recharts para renderizar gráficos interactivos. Los datos se pueden filtrar
 * por producto y rango de fechas.
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
import { BarChart3 } from "lucide-react"
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

export function InventoryChart() {
  const [filters, setFilters] = useState<AnalyticsFiltersState>({})
  const [productId, setProductId] = useState<string>("")
  const [chartType, setChartType] = useState<ChartType>("line")

  // Usar hook personalizado para carga de datos
  const { data, loading, error, reload } = useChartData({
    loadFunction: analyticsApi.getMonthlyProduction,
    filters,
    additionalFilterId: productId,
    additionalFilterKey: 'productId',
    errorMessage: 'No se pudo cargar la producción mensual',
  })

  const handleFiltersChange = useCallback((newFilters: AnalyticsFiltersState) => {
    setFilters(newFilters)
    if (newFilters.productId !== undefined) {
      setProductId(newFilters.productId)
    }
  }, [])

  const handleSearch = useCallback((searchFilters: AnalyticsFiltersState) => {
    setFilters({
      ...searchFilters,
      productId: productId || searchFilters.productId || undefined,
    })
    reload()
  }, [productId, reload])

  const handleClear = useCallback(() => {
    setProductId("")
    reload()
  }, [reload])

  // Calcular total y formatear datos para el gráfico usando useMemo
  const sortedData = useMemo(() => sortMonthlyData(data), [data])
  
  const total = useMemo(
    () => data.reduce((sum, item) => sum + (item.total || 0), 0),
    [data]
  )

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

  if (data.length === 0) {
    return <ChartEmptyState icon={BarChart3} message="No hay datos disponibles" />
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <div className="flex items-baseline gap-2 mb-1">
              <p className="text-3xl font-bold text-primary-900 font-mono">{total.toFixed(2)} L</p>
              <span className="text-sm font-medium text-primary-600">Total del período</span>
            </div>
          </div>
          
          {/* Selector de tipo de gráfico */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("line")}
              className={cn(
                "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 shadow-sm",
                chartType === "line"
                  ? "bg-blue-600 text-white shadow-md"
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
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-primary-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
              )}
            >
              Barras
            </button>
          </div>
        </div>

        {/* Filtros */}
        <div className="space-y-3">
          <AnalyticsFilters
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            onClear={handleClear}
            showProductFilter={true}
            productFilterComponent={
              <ProductSearchFilter
                value={productId}
                onChange={setProductId}
                placeholder="Buscar producto..."
              />
            }
          />
        </div>
      </div>

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
                tickFormatter={(value) => `${value} L`}
              />
              <Tooltip content={<ChartTooltip unit="L" labelText="Producción" color="#3b82f6" />} />
              <Bar 
                dataKey="value" 
                fill="#3b82f6"
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
                tickFormatter={(value) => `${value} L`}
              />
              <Tooltip content={<ChartTooltip unit="L" labelText="Producción" color="#3b82f6" />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fill="#3b82f6"
                fillOpacity={0.1}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
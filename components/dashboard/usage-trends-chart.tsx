"use client"

/**
 * Componente UsageTrendsChart - Gráfico de consumo de materiales mensual
 * Muestra el consumo de materiales a lo largo del tiempo usando datos reales con filtros
 * Migrado a Recharts para mejor integración y estilo moderno
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
import { Box } from "lucide-react"
import { analyticsApi } from "@/lib/analytics"
import { MonthlyTotalDTO } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { AnalyticsFilters, AnalyticsFiltersState } from "./analytics-filters"
import { MaterialSearchFilter } from "@/app/(dashboard)/movimientos/_components/material-search-filter"
import { cn, formatMonthLabel, sortMonthlyData } from "@/lib/utils"
import { ChartLoadingState } from "./chart-loading-state"
import { ChartEmptyState } from "./chart-empty-state"
import { ChartTooltip } from "./chart-tooltip"
import { useChartData } from "@/hooks/use-chart-data"

type ChartType = "line" | "bar"

export function UsageTrendsChart() {
  const [filters, setFilters] = useState<AnalyticsFiltersState>({})
  const [materialId, setMaterialId] = useState<string>("")
  const [chartType, setChartType] = useState<ChartType>("line")

  // Usar hook personalizado para carga de datos
  const { data, loading, error, reload } = useChartData({
    loadFunction: analyticsApi.getMonthlyMaterialConsumption,
    filters,
    additionalFilterId: materialId,
    additionalFilterKey: 'materialId',
    errorMessage: 'No se pudo cargar el consumo de materiales',
  })

  const handleFiltersChange = useCallback((newFilters: AnalyticsFiltersState) => {
    // Solo actualizar si hay valores reales, no valores vacíos por defecto
    // Esto evita que se resetee el componente hijo cuando se inicializa
    if (newFilters.preset || newFilters.startDate || newFilters.endDate) {
      setFilters(newFilters)
      if (newFilters.materialId !== undefined) {
        setMaterialId(newFilters.materialId)
      }
    }
  }, [])

  const handleSearch = useCallback((searchFilters: AnalyticsFiltersState) => {
    setFilters({
      ...searchFilters,
      materialId: materialId || searchFilters.materialId || undefined,
    })
    reload()
  }, [materialId, reload])

  const handleClear = useCallback(() => {
    setMaterialId("")
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
    return <ChartLoadingState color="orange" />
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
                <p className="text-3xl font-bold text-primary-900 font-mono">{total.toFixed(2)} kg</p>
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
                    ? "bg-orange-600 text-white shadow-md"
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
                    ? "bg-orange-600 text-white shadow-md"
                    : "bg-white text-primary-700 border border-gray-200 hover:bg-gray-50 hover:shadow-md"
                )}
              >
                Barras
              </button>
            </div>
          )}
        </div>

        {/* Filtros */}
        <div className="mb-4">
          <AnalyticsFilters
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            onClear={handleClear}
            showMaterialFilter={true}
            materialFilterComponent={
              <MaterialSearchFilter
                value={materialId}
                onChange={setMaterialId}
                placeholder="Buscar material..."
              />
            }
            currentMaterialId={materialId}
          />
        </div>
      </div>

      {data.length === 0 ? (
        <ChartEmptyState icon={Box} message="No hay datos disponibles" />
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
                tickFormatter={(value) => `${value} kg`}
              />
              <Tooltip content={<ChartTooltip unit="kg" labelText="Consumo" color="#f97316" />} />
              <Bar 
                dataKey="value" 
                fill="#f97316"
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
                tickFormatter={(value) => `${value} kg`}
              />
              <Tooltip content={<ChartTooltip unit="kg" labelText="Consumo" color="#f97316" />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f97316" 
                strokeWidth={3}
                fill="#f97316"
                fillOpacity={0.1}
                dot={{ fill: '#f97316', strokeWidth: 2, r: 4 }}
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
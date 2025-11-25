"use client"

/**
 * Componente WasteChart - Gráfico de desperdicios mensuales
 * Muestra los desperdicios generados mensualmente usando datos reales del backend con filtros
 * Migrado a Recharts para mejor integración y estilo moderno
 */

import { useState, useMemo, useCallback } from "react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { AlertTriangle } from "lucide-react"
import { analyticsApi } from "@/lib/analytics"
import { MonthlyTotalDTO, Phase } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { AnalyticsFilters, AnalyticsFiltersState } from "./analytics-filters"
import { cn, formatMonthLabel, sortMonthlyData } from "@/lib/utils"
import { ChartLoadingState } from "./chart-loading-state"
import { ChartEmptyState } from "./chart-empty-state"
import { ChartTooltip } from "./chart-tooltip"
import { useChartData } from "@/hooks/use-chart-data"

type ChartType = "bar" | "line"

import { PIE_CHART_COLORS } from '@/lib/constants'

export function WasteChart() {
  const [filters, setFilters] = useState<AnalyticsFiltersState>({})
  const [phase, setPhase] = useState<string>("")
  const [transferOnly, setTransferOnly] = useState<boolean>(false)
  const [chartType, setChartType] = useState<ChartType>("line")

  // Memoizar filtros adicionales para evitar recreaciones innecesarias
  const additionalFilters = useMemo(() => ({
    phase: phase || filters.phase || undefined,
    transferOnly: filters.transferOnly !== undefined ? filters.transferOnly : transferOnly,
  }), [phase, filters.phase, filters.transferOnly, transferOnly])

  // Usar hook personalizado para carga de datos
  const { data, loading, error, reload } = useChartData({
    loadFunction: analyticsApi.getMonthlyWaste,
    filters,
    additionalFilters,
    errorMessage: 'No se pudo cargar los desperdicios mensuales',
  })

  const handleFiltersChange = useCallback((newFilters: AnalyticsFiltersState) => {
    // Solo actualizar si hay valores reales, no valores vacíos por defecto
    // Esto evita que se resetee el componente hijo cuando se inicializa
    if (newFilters.preset || newFilters.startDate || newFilters.endDate) {
      setFilters(newFilters)
      if (newFilters.phase !== undefined) {
        setPhase(newFilters.phase)
      }
      if (newFilters.transferOnly !== undefined) {
        setTransferOnly(newFilters.transferOnly)
      }
    }
  }, [])

  const handleSearch = useCallback((searchFilters: AnalyticsFiltersState) => {
    setFilters({
      ...searchFilters,
      phase: phase || searchFilters.phase || undefined,
      transferOnly: searchFilters.transferOnly !== undefined ? searchFilters.transferOnly : transferOnly,
    })
    reload()
  }, [phase, transferOnly, reload])

  const handleClear = useCallback(() => {
    setPhase("")
    setTransferOnly(false)
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

  // Tooltip personalizado para pie chart con porcentaje
  const PieTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string; payload?: any }> }) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0]
    const percentage = ((data.value / total) * 100).toFixed(1)
    
    return (
      <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 border border-red-500/50">
        <p className="font-semibold mb-1">{data.name}</p>
        <p className="text-sm">
          Desperdicios: <span className="font-mono font-bold">{data.value.toFixed(2)} L</span>
          <span className="ml-2 text-gray-400">({percentage}%)</span>
        </p>
      </div>
    )
  }

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
                <p className="text-3xl font-bold text-primary-900 font-mono">{total.toFixed(2)} L</p>
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
                    ? "bg-red-600 text-white shadow-md"
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
                    ? "bg-red-600 text-white shadow-md"
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
            showPhaseFilter={true}
            showTransferOnly={true}
          />
        </div>
      </div>

      {data.length === 0 ? (
        <ChartEmptyState icon={AlertTriangle} message="No hay datos disponibles" />
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
                tickFormatter={(value) => `${value} L`}
              />
              <Tooltip content={<ChartTooltip unit="L" labelText="Desperdicios" color="#ef4444" />} />
              <Bar 
                dataKey="value" 
                fill="#ef4444"
                radius={[8, 8, 0, 0]}
                fillOpacity={0.8}
              />
            </BarChart>
          ) : chartType === "line" ? (
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
              <Tooltip content={<ChartTooltip unit="L" labelText="Desperdicios" color="#ef4444" />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#ef4444" 
                strokeWidth={3}
                fill="#ef4444"
                fillOpacity={0.1}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          ) : (
            <></>
          )}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
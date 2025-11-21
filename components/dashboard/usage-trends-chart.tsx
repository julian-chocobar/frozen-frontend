"use client"

/**
 * Componente UsageTrendsChart - Gráfico de consumo de materiales mensual
 * Muestra el consumo de materiales a lo largo del tiempo usando datos reales con filtros
 */

import { useEffect, useState } from "react"
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { analyticsApi } from "@/lib/analytics-api"
import { MonthlyTotalDTO } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { AnalyticsFilters, AnalyticsFiltersState } from "./analytics-filters"
import { MaterialSearchFilter } from "@/app/(dashboard)/movimientos/_components/material-search-filter"
import { cn } from "@/lib/utils"

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

type ChartType = "line" | "bar"

export function UsageTrendsChart() {
  const [data, setData] = useState<MonthlyTotalDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFiltersState>({})
  const [materialId, setMaterialId] = useState<string>("")
  const [chartType, setChartType] = useState<ChartType>("line")
  const [shouldLoad, setShouldLoad] = useState(true)

  useEffect(() => {
    if (!shouldLoad) return
    
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const monthlyData = await analyticsApi.getMonthlyMaterialConsumption({
          startDate: filters.startDate,
          endDate: filters.endDate,
          materialId: materialId || filters.materialId || undefined,
        })
        setData(monthlyData)
      } catch (err) {
        console.error('Error cargando consumo de materiales:', err)
        setError('No se pudo cargar el consumo de materiales')
      } finally {
        setLoading(false)
        setShouldLoad(false)
      }
    }
    loadData()
  }, [shouldLoad, filters, materialId])

  const handleFiltersChange = (newFilters: AnalyticsFiltersState) => {
    setFilters(newFilters)
    // Sincronizar materialId si viene en los filtros
    if (newFilters.materialId !== undefined) {
      setMaterialId(newFilters.materialId)
    }
  }

  const handleSearch = (searchFilters: AnalyticsFiltersState) => {
    // Usar los filtros que vienen del componente de filtros
    setFilters({
      ...searchFilters,
      materialId: materialId || searchFilters.materialId || undefined,
    })
    setShouldLoad(true)
  }

  const handleClear = () => {
    setMaterialId("")
    setShouldLoad(true)
  }

  const formatMonthLabel = (item: MonthlyTotalDTO): string => {
    // Si hay monthName, usarlo directamente
    if (item.monthName) {
      return item.monthName
    }
    
    // Si month es string (nombre del mes), usarlo directamente
    if (typeof item.month === 'string') {
      return item.month
    }
    
    // Si month es number, formatearlo
    if (typeof item.month === 'number' && item.month >= 1 && item.month <= 12) {
      const monthNames = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
      ]
      const monthLabel = monthNames[item.month - 1]
      // Si hay year, incluirlo
      if (item.year) {
        return `${monthLabel} ${item.year}`
      }
      return monthLabel
    }
    
    // Fallback
    return `Mes ${item.month || 'N/A'}`
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-1">Consumo de Materiales</h3>
            <p className="text-sm text-primary-600">Cargando datos...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-1">Consumo de Materiales</h3>
          </div>
        </div>
        <ErrorState message={error} />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-1">Consumo de Materiales</h3>
            <p className="text-sm text-primary-600">No hay datos disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.month - b.month
  })

  const chartData = {
    labels: sortedData.map(formatMonthLabel),
    datasets: [
      {
        label: 'Consumo (kg)',
        data: sortedData.map(item => item.total || 0),
        borderColor: 'rgba(37, 99, 235, 1)',
        backgroundColor: chartType === "line" 
          ? 'rgba(37, 99, 235, 0.1)' 
          : 'rgba(37, 99, 235, 0.8)',
        tension: chartType === "line" ? 0.4 : undefined,
        fill: chartType === "line",
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Consumo: ${context.parsed.y.toFixed(2)} kg`
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `${value} kg`
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        }
      }
    },
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-primary-900 mb-1">Consumo de Materiales</h3>
          <p className="text-sm text-primary-600">Rastrea tus patrones de consumo a lo largo del tiempo</p>
        </div>

        {/* Selector de tipo de gráfico */}
        <div className="flex gap-2">
          <button
            onClick={() => setChartType("line")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
              chartType === "line"
                ? "bg-primary-600 text-white"
                : "bg-surface-secondary text-primary-900 hover:bg-stroke"
            )}
          >
            Líneas
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={cn(
              "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
              chartType === "bar"
                ? "bg-primary-600 text-white"
                : "bg-surface-secondary text-primary-900 hover:bg-stroke"
            )}
          >
            Barras
          </button>
        </div>
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
        />
      </div>

      <div style={{ height: '300px' }}>
        {chartType === "line" ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>
    </div>
  )
}

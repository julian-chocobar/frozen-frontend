"use client"

/**
 * Componente WasteChart - Gráfico de desperdicios mensuales
 * Muestra los desperdicios generados mensualmente usando datos reales del backend con filtros
 */

import { useEffect, useState } from "react"
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { analyticsApi } from "@/lib/analytics-api"
import { MonthlyTotalDTO, Phase } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { AnalyticsFilters, AnalyticsFiltersState } from "./analytics-filters"
import { cn } from "@/lib/utils"

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

type ChartType = "bar" | "pie" | "line"

export function WasteChart() {
  const [data, setData] = useState<MonthlyTotalDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFiltersState>({})
  const [phase, setPhase] = useState<string>("")
  const [transferOnly, setTransferOnly] = useState<boolean>(false)
  const [chartType, setChartType] = useState<ChartType>("line")
  const [shouldLoad, setShouldLoad] = useState(true)

  useEffect(() => {
    if (!shouldLoad) return
    
    const loadData = async () => {
      setLoading(true)
      setError(null)
      try {
        const monthlyData = await analyticsApi.getMonthlyWaste({
          startDate: filters.startDate,
          endDate: filters.endDate,
          phase: phase || filters.phase || undefined,
          transferOnly: filters.transferOnly !== undefined ? filters.transferOnly : transferOnly,
        })
        setData(monthlyData)
      } catch (err) {
        console.error('Error cargando desperdicios mensuales:', err)
        setError('No se pudo cargar los desperdicios mensuales')
      } finally {
        setLoading(false)
        setShouldLoad(false)
      }
    }
    loadData()
  }, [shouldLoad, filters, phase, transferOnly])

  const handleFiltersChange = (newFilters: AnalyticsFiltersState) => {
    setFilters(newFilters)
    // Sincronizar phase y transferOnly si vienen en los filtros
    if (newFilters.phase !== undefined) {
      setPhase(newFilters.phase)
    }
    if (newFilters.transferOnly !== undefined) {
      setTransferOnly(newFilters.transferOnly)
    }
  }

  const handleSearch = (searchFilters: AnalyticsFiltersState) => {
    // Usar los filtros que vienen del componente de filtros
    setFilters({
      ...searchFilters,
      phase: phase || searchFilters.phase || undefined,
      transferOnly: searchFilters.transferOnly !== undefined ? searchFilters.transferOnly : transferOnly,
    })
    setShouldLoad(true)
  }

  const handleClear = () => {
    setPhase("")
    setTransferOnly(false)
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
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-1">Desperdicios Mensuales</h3>
          <p className="text-sm text-primary-600">Cargando datos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-1">Desperdicios Mensuales</h3>
        </div>
        <ErrorState message={error} />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-primary-900 mb-1">Desperdicios Mensuales</h3>
          <p className="text-sm text-primary-600">No hay datos disponibles</p>
        </div>
      </div>
    )
  }

  // Calcular total y formatear datos para el gráfico
  const total = data.reduce((sum, item) => sum + (item.total || 0), 0)
  const sortedData = [...data].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year
    return a.month - b.month
  })

  const barChartData = {
    labels: sortedData.map(formatMonthLabel),
    datasets: [
      {
        label: 'Desperdicios (L)',
        data: sortedData.map(item => item.total || 0),
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  }

  const lineChartData = {
    labels: sortedData.map(formatMonthLabel),
    datasets: [
      {
        label: 'Desperdicios (L)',
        data: sortedData.map(item => item.total || 0),
        borderColor: 'rgba(239, 68, 68, 1)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
        borderWidth: 2,
      },
    ],
  }

  const pieChartData = {
    labels: sortedData.map(formatMonthLabel),
    datasets: [
      {
        label: 'Desperdicios (L)',
        data: sortedData.map(item => item.total || 0),
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(239, 68, 68, 0.5)',
          'rgba(220, 38, 38, 0.8)',
          'rgba(220, 38, 38, 0.7)',
          'rgba(220, 38, 38, 0.6)',
          'rgba(220, 38, 38, 0.5)',
        ],
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
    ],
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Desperdicios: ${context.parsed.y.toFixed(2)} L`
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `${value} L`
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

  const lineOptions = {
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
            return `Desperdicios: ${context.parsed.y.toFixed(2)} L`
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return `${value} L`
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

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || ''
            const value = context.parsed || 0
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
            const percentage = ((value / total) * 100).toFixed(1)
            return `${label}: ${value.toFixed(2)} L (${percentage}%)`
          }
        }
      },
    },
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-900 mb-1">Desperdicios Mensuales</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-primary-900 font-mono">{total.toFixed(2)} L</p>
              <span className="text-sm font-medium text-primary-600">Total del período</span>
            </div>
          </div>
          
          {/* Selector de tipo de gráfico */}
          <div className="flex gap-2">
            <button
              onClick={() => setChartType("line")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                chartType === "line"
                  ? "bg-alert-600 text-white"
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
                  ? "bg-alert-600 text-white"
                  : "bg-surface-secondary text-primary-900 hover:bg-stroke"
              )}
            >
              Barras
            </button>
            <button
              onClick={() => setChartType("pie")}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                chartType === "pie"
                  ? "bg-alert-600 text-white"
                  : "bg-surface-secondary text-primary-900 hover:bg-stroke"
              )}
            >
              Torta
            </button>
          </div>
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

      <div style={{ height: '300px' }}>
        {chartType === "bar" ? (
          <Bar data={barChartData} options={barOptions} />
        ) : chartType === "line" ? (
          <Line data={lineChartData} options={lineOptions} />
        ) : (
          <Pie data={pieChartData} options={pieOptions} />
        )}
      </div>
    </div>
  )
}

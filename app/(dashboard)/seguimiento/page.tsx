'use client';

/**
 * Página de Seguimiento de Producción
 * Muestra todos los lotes activos con su progreso y estado
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Header } from "@/components/layout/header"
import { BatchStats } from "@/components/production/batch-stats"
import { StatsCarousel } from "@/components/ui/stats-carousel"
import { StatCard } from "@/components/dashboard/stat-card"
import { getBatches, processBatchesToday } from "@/lib/batches"
import { calculateBatchStats } from "@/lib/batches/utils"
import { BatchesClient } from "./_components/batches-client"
import { BatchesFilters } from "./_components/batches-filters"
import { BatchesLoadingState } from "@/components/batches/batches-loading-state"
import { BatchesErrorState } from "@/components/batches/batches-error-state"
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'
import { Package, Play, Pause, CheckCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BatchResponse, BatchStatus } from "@/types"
import { 
  BATCH_PAGINATION, 
  BATCH_ERROR_MESSAGES, 
  BATCH_SUCCESS_MESSAGES 
} from "@/lib/constants"

// Tipo para los datos de la página
interface BatchesPageData {
  batches: BatchResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

export default function SeguimientoPage() {
  const searchParams = useSearchParams()
  const [batchesData, setBatchesData] = useState<BatchesPageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)
  const [processingBatches, setProcessingBatches] = useState(false)
  const { toast } = useToast()

  // Obtener parámetros de búsqueda memoizados
  const filters = useMemo(() => ({
    page: parseInt(searchParams.get('page') || '0'),
    size: BATCH_PAGINATION.DEFAULT_PAGE_SIZE,
    status: searchParams.get('status') as BatchStatus | undefined,
    productId: searchParams.get('productId') || undefined
  }), [searchParams])

  // Callback para forzar actualización
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // Escuchar cambios de navegación para forzar refresh
  useEffect(() => {
    window.addEventListener('focus', handleRefresh)
    return () => window.removeEventListener('focus', handleRefresh)
  }, [handleRefresh])

  // Cargar datos cuando cambien los parámetros o refreshKey
  useEffect(() => {
    const loadBatches = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getBatches(filters)
        setBatchesData(data)
      } catch (err) {
        console.error('Error cargando lotes:', err)
        if (err instanceof Error) {
          if (err.message.includes('conectar con el backend') || 
              err.message.includes('ECONNREFUSED') || 
              err.message.includes('fetch failed')) {
            setError(BATCH_ERROR_MESSAGES.NETWORK_ERROR)
          } else {
            setError(err.message)
          }
        } else {
          setError(BATCH_ERROR_MESSAGES.FETCH_FAILED)
        }
      } finally {
        setLoading(false)
      }
    }

    loadBatches()
  }, [filters, refreshKey])

  // Callback para procesar lotes de hoy
  const handleProcessBatchesToday = useCallback(async () => {
    setProcessingBatches(true)
    
    try {
      await processBatchesToday()
      toast({
        title: "Proceso iniciado correctamente",
        description: BATCH_SUCCESS_MESSAGES.PROCESS_TODAY_SUCCESS,
        variant: "default"
      })
      handleRefresh()
    } catch (err) {
      console.error('Error procesando lotes:', err)
      toast({
        title: "Error al procesar lotes",
        description: err instanceof Error ? err.message : BATCH_ERROR_MESSAGES.PROCESS_TODAY_FAILED,
        variant: "destructive"
      })
    } finally {
      setProcessingBatches(false)
    }
  }, [toast, handleRefresh])

  // Callback para reintentar carga
  const handleRetry = useCallback(() => {
    handleRefresh()
  }, [handleRefresh])

  // Calcular estadísticas memoizadas
  const stats = useMemo(() => {
    if (!batchesData?.batches) {
      return {
        total: 0,
        pendientes: 0,
        enProduccion: 0,
        enEspera: 0,
        completados: 0,
        cancelados: 0,
        volumenTotal: 0
      }
    }
    return calculateBatchStats(batchesData.batches)
  }, [batchesData?.batches])

  return (
    <>
      <Header
        title="Seguimiento de Producción"
        subtitle="Monitorea el progreso de los lotes en tiempo real"
      />
      
      <div className="p-4 md:p-6 space-y-6 text-primary-900">
        {/* Tarjetas de estadísticas - Carrusel horizontal */}
        <div className="w-full" data-tour="batches-stats">
          <StatsCarousel>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Total de Lotes" 
              value={stats.total.toString()} 
              subtitle="Todos los lotes" 
              icon={Package}
              variant="primary" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Pendientes" 
              value={stats.pendientes.toString()} 
              subtitle="Esperando inicio" 
              icon={Clock}
              variant="default" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="En Producción" 
              value={stats.enProduccion.toString()} 
              subtitle="Activos en proceso" 
              icon={Play}
              variant="success" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="En Espera" 
              value={stats.enEspera.toString()} 
              subtitle="Pausados temporalmente" 
              icon={Pause}
              variant="default" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Completados" 
              value={stats.completados.toString()} 
              subtitle="Finalizados exitosamente" 
              icon={CheckCircle}
              variant="success" 
            />
          </div>
          <div className="flex-shrink-0 w-[85vw] sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.667rem)] lg:w-[calc(25%-0.75rem)]">
            <StatCard 
              title="Volumen Total" 
              value={stats.volumenTotal.toString()} 
              subtitle="Litros en proceso" 
              icon={Package}
              variant="default" 
            />
          </div>
        </StatsCarousel>
        </div>

        {/* Recuadro con título, filtros */}
        <div className="card border-2 border-primary-600 p-6 overflow-hidden mb-6">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4" data-tour="batches-header">
            {/* Título y subtítulo */}
            <div className="flex-shrink-0 min-w-0">
              <h2 className="text-xl font-semibold text-primary-900 mb-1">Lotes de Producción</h2>
              <p className="text-sm text-primary-600">Monitoreo en tiempo real de todos los lotes activos</p>
            </div>
            
            {/* Botón de procesar y filtros */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto xl:ml-auto">
              {/* Botón para iniciar producción - Solo gerentes */}
              <div className="flex-shrink-0 w-full sm:w-auto" data-tour="batches-process">
                <Button
                  onClick={handleProcessBatchesToday}
                  disabled={processingBatches}
                  variant="outline"
                  className="gap-2 w-full sm:w-auto border-primary-300 text-primary-700 hover:bg-primary-50 disabled:opacity-50 disabled:text-primary-300 disabled:border-primary-200"
                >
                  <Play className="w-4 h-4" />
                  {processingBatches ? "Procesando..." : "Iniciar Producción Hoy"}
                </Button>
              </div>

              {/* Filtros */}
              <div className="flex-shrink-0 w-full sm:w-auto" data-tour="batches-filters">
                <BatchesFilters />
              </div>
            </div>
          </div>
        </div>

        {/* Lotes */}
        {error ? (
          <BatchesErrorState 
            message={error}
            onRetry={handleRetry}
            isRetrying={loading}
          />
        ) : loading ? (
          <BatchesLoadingState count={BATCH_PAGINATION.DEFAULT_PAGE_SIZE} variant="grid" />
        ) : batchesData ? (
          <div className="w-full" data-tour="batches-grid">
            <BatchesClient
              batches={batchesData.batches}
              pagination={batchesData.pagination}
            />
          </div>
        ) : null}
      </div>
    </>
  )
}

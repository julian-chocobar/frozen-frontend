'use client';

/**
 * Página de Seguimiento de Producción
 * Muestra todos los lotes activos con su progreso y estado
 */

import { useState, useEffect } from 'react'
import { Header } from "@/components/layout/header"
import { BatchStats } from "@/components/production/batch-stats"
import { StatsCarousel } from "@/components/ui/stats-carousel"
import { StatCard } from "@/components/dashboard/stat-card"
import { getBatches, processBatchesToday } from "@/lib/batches-api"
import { BatchesClient } from "./_components/batches-client"
import { BatchesFilters } from "./_components/batches-filters"
import { ErrorState } from "@/components/ui/error-state"
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'
import { Package, Play, Pause, CheckCircle, XCircle, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { BatchResponse, BatchStatus } from "@/types"

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

  // Obtener parámetros de búsqueda
  const page = parseInt(searchParams.get('page') || '0')
  const status = searchParams.get('status') as BatchStatus | undefined
  const productId = searchParams.get('productId') || undefined
  const autoOpenId = searchParams.get('id') || undefined

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
    const loadBatches = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getBatches({
          page,
          size: 12, // Grid de 3x4
          status,
          productId
        })
        setBatchesData(data)
      } catch (err) {
        console.error('Error cargando lotes:', err)
        if (err instanceof Error) {
          if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
            setError('No se pudo conectar con el backend')
          } else {
            setError(err.message)
          }
        } else {
          setError('No se pudieron cargar los lotes')
        }
      } finally {
        setLoading(false)
      }
    }

    loadBatches()
  }, [page, status, productId, refreshKey])

  const handleProcessBatchesToday = async () => {
    setProcessingBatches(true)
    
    try {
      await processBatchesToday()
      toast({
        title: "Proceso iniciado correctamente",
        description: "Se han procesado los lotes programados para hoy",
        variant: "default"
      })
      // Recargar los datos
      setRefreshKey(prev => prev + 1)
    } catch (err) {
      console.error('Error procesando lotes:', err)
      toast({
        title: "Error al procesar lotes",
        description: err instanceof Error ? err.message : "No se pudo procesar los lotes de hoy",
        variant: "destructive"
      })
    } finally {
      setProcessingBatches(false)
    }
  }

  // Calcular estadísticas
  const stats = {
    total: batchesData?.batches?.length || 0,
    pendientes: batchesData?.batches?.filter(b => b.status === 'PENDIENTE').length || 0,
    enProduccion: batchesData?.batches?.filter(b => b.status === 'EN_PRODUCCION').length || 0,
    enEspera: batchesData?.batches?.filter(b => b.status === 'EN_ESPERA').length || 0,
    completados: batchesData?.batches?.filter(b => b.status === 'COMPLETADO').length || 0,
    cancelados: batchesData?.batches?.filter(b => b.status === 'CANCELADO').length || 0,
    volumenTotal: batchesData?.batches?.reduce((sum, batch) => sum + batch.quantity, 0) || 0
  }

  return (
    <>
      <Header
        title="Seguimiento de Producción"
        subtitle="Monitorea el progreso de los lotes en tiempo real"
      />
      
      <div className="p-4 md:p-6 space-y-6 text-primary-900">
        {/* Tarjetas de estadísticas - Carrusel horizontal */}
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

        {/* Recuadro con título, filtros */}
        <div className="card border-2 border-primary-600 p-6 overflow-hidden">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            {/* Título y subtítulo */}
            <div className="flex-shrink-0 min-w-0">
              <h2 className="text-xl font-semibold text-primary-900 mb-1">Lotes de Producción</h2>
              <p className="text-sm text-primary-600">Monitoreo en tiempo real de todos los lotes activos</p>
            </div>
            
            {/* Botón de procesar y filtros */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full xl:w-auto xl:ml-auto">
              {/* Botón para iniciar producción - Solo gerentes */}
              <div className="flex-shrink-0 w-full sm:w-auto">
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
              <div className="flex-shrink-0 w-full sm:w-auto">
                <BatchesFilters />
              </div>
            </div>
          </div>
        </div>

        {/* Lotes */}
        {error ? (
          <div className="card border-2 border-primary-600">
            <ErrorState error={error} />
          </div>
        ) : loading ? (
          <div className="card border-2 border-primary-600 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-primary-600">Cargando lotes...</p>
          </div>
        ) : batchesData ? (
          <>
            <BatchesClient
              batches={batchesData.batches}
              pagination={batchesData.pagination}
            />
          </>
        ) : null}
      </div>
    </>
  )
}

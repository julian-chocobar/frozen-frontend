'use client';

/**
 * Página de Movimientos de Stock (materias primas)
 */
import { Header } from "@/components/layout/header"
import { MovementCreateButton } from "./_components/create-button"
import { getMovements } from "@/lib/movements-api"
import { MovementsFilters } from "./_components/movements-filters"
import { MovementsClient } from "./_components/movements-client"
import { PaginationClient } from "@/components/ui/pagination-client"
import { ErrorState } from "@/components/ui/error-state"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { MovementResponse } from "@/types"

// Tipo para los datos de la página
interface MovementsPageData {
  movements: MovementResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

export default function MovimientosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [movementsData, setMovementsData] = useState<MovementsPageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshKey, setRefreshKey] = useState(0)


  // Obtener parámetros de búsqueda
  const page = parseInt(searchParams.get('page') || '0')
  const type = searchParams.get('type') || undefined
  const materialId = searchParams.get('materialId') || undefined
  const dateFrom = searchParams.get('dateFrom') || undefined
  const dateTo = searchParams.get('dateTo') || undefined
  const reason = searchParams.get('reason') || undefined
  const autoOpenId = searchParams.get('id') || undefined // Para abrir modal automáticamente

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
    const loadMovements = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getMovements({
          page,
          type,
          materialId,
          dateFrom,
          dateTo,
          size: 10
        })
        setMovementsData(data)
      } catch (err) {
        console.error('Error al cargar movimientos:', err)
        
        // Detectar tipo de error para mostrar mensaje apropiado
        if (err instanceof Error) {
          if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
            setError('No se pudo conectar con el backend')
          } else {
            setError(err.message)
          }
        } else {
          setError('No se pudieron cargar los movimientos')
        }
      } finally {
        setLoading(false)
      }
    }

    loadMovements()
  }, [page, type, materialId, dateFrom, dateTo, reason, refreshKey])

  return (
    <>
      <Header
        title="Movimientos de Stock"
        subtitle="Administra los movimientos de stock de insumos"
      />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* Filtros */}
        <MovementsFilters />

        <div className="card border-2 border-primary-600 overflow-hidden">
          <div className="p-6 border-b border-stroke">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-1">Movimientos de Stock</h2>
                <p className="text-sm text-primary-600">Historial de entradas y salidas de materiales</p>
              </div>
              {!loading && movementsData && (
                <MovementCreateButton onCreateCallback={() => setRefreshKey(prev => prev + 1)} />
              )}
            </div>
          </div>
          
          {error ? (
            <ErrorState error={error} />
          ) : loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-primary-600">Cargando movimientos...</p>
            </div>
          ) : movementsData ? (
            <MovementsClient 
              movements={movementsData.movements} 
              pagination={movementsData.pagination}
              autoOpenId={autoOpenId}
            />
          ) : null}
        </div>

        {/* Contador de resultados y paginación */}
        {movementsData && (
          <div className="text-center space-y-4">
            <p className="text-sm text-primary-700">
              Mostrando {movementsData.movements.length} movimientos de {movementsData.pagination.totalElements} totales
            </p>
            
            {/* Paginación funcional */}
            <PaginationClient 
              currentPage={movementsData.pagination.currentPage}
              totalPages={movementsData.pagination.totalPages}
            />
          </div>
        )}
      </div>
    </>
  )
}


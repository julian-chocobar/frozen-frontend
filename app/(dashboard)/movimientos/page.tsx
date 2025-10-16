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

interface MovimientosPageProps {
  searchParams: Promise<{
    page?: string
    type?: string // Tipo de movimiento: INGRESO, EGRESO
    materialId?: string // ID del material
    dateFrom?: string // Fecha desde
    dateTo?: string // Fecha hasta
    reason?: string // Motivo del movimiento
  }>
}

export default async function MovimientosPage({ searchParams }: MovimientosPageProps) {
  // Obtener parámetros de búsqueda (await searchParams en Next.js 15)
  const params = await searchParams
  const page = parseInt(params.page || '0')
  const type = params.type
  const materialId = params.materialId
  const dateFrom = params.dateFrom
  const dateTo = params.dateTo
  const reason = params.reason

  // Obtener datos del backend
  let movementsData
  let error: string | null = null

  try {
    movementsData = await getMovements({
      page,
      type,
      materialId,
      dateFrom,
      dateTo,
      size: 10
    })
  } catch (err) {
    console.error('Error al cargar movimientos:', err)
    
    // Detectar tipo de error para mostrar mensaje apropiado
    if (err instanceof Error) {
      if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
        error = 'No se pudo conectar con el backend'
      } else {
        error = err.message
      }
    } else {
      error = 'No se pudieron cargar los movimientos'
    }
  }

  return (
    <>
      <Header
        title="Movimientos de Stock"
        subtitle="Administra los movimientos de stock de insumos"
        notificationCount={2}
        actionButton={<MovementCreateButton />}
      />
      
      <div className="p-4 md:p-6 space-y-6">
        {/* Filtros */}
        <MovementsFilters />

        <div className="card border-2 border-primary-600 overflow-hidden">
          <div className="p-6 border-b border-stroke">
            <h2 className="text-xl font-semibold text-primary-900 mb-1">Movimientos de Stock</h2>
            <p className="text-sm text-primary-600">Historial de entradas y salidas de materiales</p>
          </div>
          
          {error ? (
            <ErrorState error={error} />
          ) : movementsData ? (
            <MovementsClient 
              movements={movementsData.movements} 
              pagination={movementsData.pagination}
            />
          ) : (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-primary-600">Cargando movimientos...</p>
            </div>
          )}
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


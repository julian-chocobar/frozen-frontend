/**
 * Página de Materias Primas
 * Muestra el inventario completo con filtros y búsqueda
 */

import { Header } from "@/components/layout/header"
import { MaterialsFilters } from "./_components/materials-filters"
import { MaterialsClient } from "./_components/materials-client"
import { PaginationClient } from "./_components/pagination-client"
import { ErrorState } from "@/components/ui/error-state"
import { MaterialCreateButton } from "./_components/create-button"
import { getMaterials } from "@/lib/materials-api"

interface MaterialesPageProps {
  searchParams: Promise<{
    page?: string
    type?: string
    estado?: string
    name?: string
    supplier?: string
  }>
}

export default async function MaterialesPage({ searchParams }: MaterialesPageProps) {
  // Obtener parámetros de búsqueda (await searchParams en Next.js 15)
  const params = await searchParams
  const page = parseInt(params.page || '0')
  const type = params.type
  const estado = params.estado
  const name = params.name
  const supplier = params.supplier

  // Obtener datos del backend
  let materialsData
  let error: string | null = null

  try {
        materialsData = await getMaterials({
          page,
          type,
          estado,
          name,
          supplier,
          size: 10
        })
  } catch (err) {
    console.error('Error al cargar materiales:', err)
    
    // Detectar tipo de error para mostrar mensaje apropiado
    if (err instanceof Error) {
      if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
        error = 'No se pudo conectar con el backend'
      } else {
        error = err.message
      }
    } else {
      error = 'No se pudieron cargar los materiales'
    }
  }

  return (
    <>
      <Header
        title="Inventario de Materiales"
        subtitle="Administra tu stock de materias primas cerveceras"
        notificationCount={2}
        actionButton={<MaterialCreateButton />}
      />
      <div className="p-4 md:p-6 space-y-6">
        {/* Filtros */}
        <MaterialsFilters />
    
        <div className="card border-2 border-primary-600 overflow-hidden">
          <div className="p-6 border-b border-stroke">
            <h2 className="text-xl font-semibold text-primary-900 mb-1">Materias Primas</h2>
            <p className="text-sm text-primary-600">Gestiona maltas, lúpulos, levaduras y otros insumos</p>
          </div>
          
          {error ? (
            <ErrorState error={error} />
          ) : materialsData ? (
            <MaterialsClient 
              materials={materialsData.materials} 
              pagination={materialsData.pagination}
            />
          ) : (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-primary-600">Cargando materiales...</p>
            </div>
          )}
        </div>

        {/* Contador de resultados y paginación */}
        {materialsData && (
          <div className="text-center space-y-4">
            <p className="text-sm text-primary-700">
              Mostrando {materialsData.materials.length} materiales de {materialsData.pagination.totalElements} totales
            </p>
            
            {/* Paginación funcional */}
            <PaginationClient 
              currentPage={materialsData.pagination.currentPage}
              totalPages={materialsData.pagination.totalPages}
            />
          </div>
        )}
      </div>
    </>
  )
}

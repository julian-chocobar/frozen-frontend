'use client';

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
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Material } from "@/types"

// Tipo para los datos de la página
interface MaterialsPageData {
  materials: Material[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

export default function MaterialesPage() {
  const searchParams = useSearchParams()
  const [materialsData, setMaterialsData] = useState<MaterialsPageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Obtener parámetros de búsqueda
  const page = parseInt(searchParams.get('page') || '0')
  const type = searchParams.get('type') || undefined
  const estado = searchParams.get('estado') || undefined
  const name = searchParams.get('name') || undefined
  const supplier = searchParams.get('supplier') || undefined

  // Cargar datos cuando cambien los parámetros
  useEffect(() => {
    const loadMaterials = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const data = await getMaterials({
          page,
          type,
          estado,
          name,
          supplier,
          size: 10
        })
        setMaterialsData(data)
      } catch (err) {
        console.error('Error al cargar materiales:', err)
        
        // Detectar tipo de error para mostrar mensaje apropiado
        if (err instanceof Error) {
          if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
            setError('No se pudo conectar con el backend')
          } else {
            setError(err.message)
          }
        } else {
          setError('No se pudieron cargar los materiales')
        }
      } finally {
        setLoading(false)
      }
    }

    loadMaterials()
  }, [page, type, estado, name, supplier])

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
          ) : loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-primary-600">Cargando materiales...</p>
            </div>
          ) : materialsData ? (
            <MaterialsClient 
              materials={materialsData.materials} 
              pagination={materialsData.pagination}
            />
          ) : null}
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

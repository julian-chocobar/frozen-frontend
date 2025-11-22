'use client';

/**
 * Página de Materias Primas
 * Muestra el inventario completo con filtros y búsqueda
 */

import { Header } from "@/components/layout/header"
import { MaterialsFilters } from "./_components/materials-filters"
import { MaterialsClient } from "./_components/materials-client"
import { ErrorState } from "@/components/ui/error-state"
import { MaterialCreateButton } from "./_components/create-button"
import { MaterialsWarehousePanel } from "./_components/warehouse-panel"
import { getMaterials } from "@/lib/materials/api"
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
  const [refreshKey, setRefreshKey] = useState(0)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null)
  const [externalViewId, setExternalViewId] = useState<string | null>(null)



  // Obtener parámetros de búsqueda
  const page = parseInt(searchParams.get('page') || '0')
  const type = searchParams.get('type') || undefined
  const estado = searchParams.get('estado') || undefined
  const name = searchParams.get('name') || undefined
  const supplier = searchParams.get('supplier') || undefined
  const autoOpenId = searchParams.get('id') || undefined // Para abrir modal automáticamente
  
  console.log('MaterialesPage autoOpenId from URL:', autoOpenId)

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
  }, [page, type, estado, name, supplier, refreshKey])

  return (
    <>
      <Header
        title="Inventario de Materiales"
        subtitle="Administra tu stock de materias primas cerveceras"
      />
      <div className="p-4 md:p-6 space-y-6">
        {/* Filtros */}
        <MaterialsFilters />
 
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="order-2 lg:order-1 lg:flex-1">
            <div className="card border-2 border-primary-600 overflow-hidden">
              <div className="p-6 border-b border-stroke">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-primary-900 mb-1">Materias Primas</h2>
                    <p className="text-sm text-primary-600">Gestiona maltas, lúpulos, levaduras y otros insumos</p>
                  </div>
                  {!loading && materialsData && (
                    <MaterialCreateButton onCreateCallback={() => setRefreshKey(prev => prev + 1)} />
                  )}
                </div>
              </div>

              {error ? (
                <ErrorState error={error} />
              ) : loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-primary-600">Cargando materiales...</p>
                </div>
              ) : materialsData ? (
                <>
                  <MaterialsClient
                    materials={materialsData.materials}
                    pagination={materialsData.pagination}
                    autoOpenId={autoOpenId}
                    onMaterialSelect={(materialId) => {
                      setSelectedMaterialId(materialId)
                      if (materialId === null) {
                        setExternalViewId(null)
                      }
                    }}
                    externalViewId={externalViewId}
                  />
                </>
              ) : null}
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:flex-none">
            <MaterialsWarehousePanel
              selectedMaterialId={selectedMaterialId}
              onSelectMaterial={(materialId) => {
                setSelectedMaterialId(materialId)
                setExternalViewId(materialId)
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}

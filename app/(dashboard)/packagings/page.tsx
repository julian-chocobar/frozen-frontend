'use client';

/**
 * Página de Packaging
 */

import { Header } from "@/components/layout/header"
import { getPackagings } from "@/lib/packagings-api"
import { PackagingsClient } from "./_components/packagings-client"
import { PackagingCreateButton } from "./_components/create-button"
import { ErrorState } from "@/components/ui/error-state"
import { PaginationClient } from "@/components/ui/pagination-client"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { PackagingResponse } from "@/types"

// Tipo para los datos de la página
interface PackagingsPageData {
  packagings: PackagingResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

export default function PackagingPage() {
  const searchParams = useSearchParams()
  const [packagingsData, setPackagingsData] = useState<PackagingsPageData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Obtener parámetros de búsqueda
  const page = parseInt(searchParams.get('page') || '0')
  const name = searchParams.get('name') || undefined
  const unitMeasurement = searchParams.get('unitMeasurement') || undefined
  const quantity = searchParams.get('quantity') || undefined

  // Cargar datos cuando cambien los parámetros
  useEffect(() => {
    const loadPackagings = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getPackagings({ page, size: 10 })
        setPackagingsData(data)
      } catch (err) {
        console.error('Error al cargar packagings:', err)
        setError('No se pudieron cargar los packagings')
      } finally {
        setLoading(false)
      }
    }

    loadPackagings()
  }, [page, name, unitMeasurement, quantity])
  return (
    <>
      <Header
        title="Packagings"
        subtitle="Administra todos los packagings disponibles"
        notificationCount={2}
        actionButton={<PackagingCreateButton />}
      />
      <div className="p-4 md:p-6 space-y-6">
        <div className="card border-2 border-primary-600 overflow-hidden">
              <div className="p-6 border-b border-stroke">
                <h2 className="text-xl font-semibold text-primary-900 mb-1">Packagings</h2>
                <p className="text-sm text-primary-600">Gestiona latas, botellas y otros envases</p>
        </div>

        {error ? (
                <ErrorState error={error} />
              ) : loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="mt-4 text-primary-600">Cargando packagings...</p>
                </div>
              ) : packagingsData ? (
                <PackagingsClient 
                  packagings={packagingsData.packagings} 
                  pagination={packagingsData.pagination}
                />
              ) : null}
        </div>
        {/* Contador de resultados y paginación */}
        {packagingsData && (
          <div className="text-center space-y-4">
            <p className="text-sm text-primary-700">
              Mostrando {packagingsData.packagings.length} packagings de {packagingsData.pagination.totalElements} totales
            </p>
            <PaginationClient 
              currentPage={packagingsData.pagination.currentPage}
              totalPages={packagingsData.pagination.totalPages}
            />
          </div>
        )}
      </div>
    </>
  )
}
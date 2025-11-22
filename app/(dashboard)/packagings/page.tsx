'use client';

/**
 * Página de Packaging
 */

import { Header } from "@/components/layout/header"
import { getPackagings } from "@/lib/packagings"
import { PackagingsClient } from "./_components/packagings-client"
import { PackagingCreateButton } from "./_components/create-button"
import { PackagingsLoadingState } from "@/components/packagings/packagings-loading-state"
import { PackagingsErrorState } from "@/components/packagings/packagings-error-state"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { PackagingResponse } from "@/types"
import { PACKAGING_PAGINATION } from "@/lib/constants"

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
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  // Memoizar parámetros de búsqueda
  const queryParams = useMemo(() => ({
    page: parseInt(searchParams.get('page') || '0'),
    name: searchParams.get('name') || undefined,
    unitMeasurement: searchParams.get('unitMeasurement') || undefined,
    quantity: searchParams.get('quantity') || undefined,
  }), [searchParams])

  // Callback para refrescar datos
  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  // Callback para reintentar carga
  const handleRetry = useCallback(() => {
    setIsRetrying(true)
    handleRefresh()
  }, [handleRefresh])

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
    const loadPackagings = async () => {
      setLoading(true)
      setError(null)

      try {
        const data = await getPackagings({ 
          page: queryParams.page, 
          size: PACKAGING_PAGINATION.DEFAULT_PAGE_SIZE 
        })
        setPackagingsData(data)
      } catch (err) {
        console.error('Error al cargar packagings:', err)
        setError('No se pudieron cargar los packagings')
      } finally {
        setLoading(false)
        setIsRetrying(false)
      }
    }

    loadPackagings()
  }, [queryParams.page, queryParams.name, queryParams.unitMeasurement, queryParams.quantity, refreshKey])
  return (
    <>
      <Header
        title="Packagings"
        subtitle="Administra todos los packagings disponibles"
      />
      <div className="p-4 md:p-6 space-y-6">
        <div className="card border-2 border-primary-600 overflow-hidden">
          <div className="p-6 border-b border-stroke">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-primary-900 mb-1">Packagings</h2>
                <p className="text-sm text-primary-600">Gestiona latas, botellas y otros envases</p>
              </div>
              {!loading && packagingsData && (
                <PackagingCreateButton onCreateCallback={handleRefresh} />
              )}
            </div>
          </div>

          {error ? (
            <PackagingsErrorState 
              message={error}
              onRetry={handleRetry}
              isRetrying={isRetrying}
            />
          ) : loading ? (
            <div className="p-6">
              <PackagingsLoadingState count={PACKAGING_PAGINATION.DEFAULT_PAGE_SIZE} />
            </div>
          ) : packagingsData ? (
                <PackagingsClient 
                  packagings={packagingsData.packagings} 
                  pagination={packagingsData.pagination}
                />
              ) : null}
        </div>
      </div>
    </>
  )
}
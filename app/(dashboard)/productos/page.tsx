'use client';

import { Header } from "@/components/layout/header"
import { ProductsClient } from "./_components/products-client"
import { ProductsFilters } from "./_components/products-filters"
import { ProductsLoadingState } from "@/components/products/products-loading-state"
import { ProductsErrorState } from "@/components/products/products-error-state"
import { ProductCreateButton } from "./_components/create-button"
import { getProducts } from "@/lib/products"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { ProductResponse } from "@/types"
import { PRODUCT_PAGINATION, PRODUCT_ERROR_MESSAGES } from "@/lib/constants"

// Tipo para los datos de la página
interface ProductsPageData {
  products: ProductResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
}

export default function ProductosPage() {
    const searchParams = useSearchParams()
    const [productsData, setProductsData] = useState<ProductsPageData | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [refreshKey, setRefreshKey] = useState(0)

    // Obtener parámetros de búsqueda memoizados
    const filters = useMemo(() => ({
      page: parseInt(searchParams.get('page') || '0'),
      name: searchParams.get('name') || undefined,
      alcoholic: searchParams.get('alcoholic') || undefined,
      estado: searchParams.get('estado') || undefined,
      ready: searchParams.get('ready') || undefined,
      size: PRODUCT_PAGINATION.DEFAULT_PAGE_SIZE
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
        const loadProducts = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await getProducts(filters)
                setProductsData(data)
            } catch (err) {
                console.error('Error al cargar productos:', err)

                if (err instanceof Error) {
                    if (err.message.includes('conectar con el backend') || 
                        err.message.includes('ECONNREFUSED') || 
                        err.message.includes('fetch failed')) {
                        setError(PRODUCT_ERROR_MESSAGES.NETWORK_ERROR)
                    } else {
                        setError(err.message)
                    }
                } else {
                    setError(PRODUCT_ERROR_MESSAGES.FETCH_FAILED)
                }
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [filters, refreshKey])

    // Callback para reintentar carga
    const handleRetry = useCallback(() => {
      handleRefresh()
    }, [handleRefresh])

    return (
        <>
            <Header
                title="Productos"
                subtitle="Gestiona tus productos"
            />
            <div className="p-4 md:p-6 space-y-6">
                {/* Filtros */}
                <div data-tour="products-filters">
                    <ProductsFilters />
                </div>
                <div className="card border-2 border-primary-600 overflow-hidden">
                    <div className="p-6 border-b border-stroke" data-tour="products-header">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-primary-900 mb-1">Productos</h2>
                                <p className="text-sm text-primary-600">Gestiona tus productos</p>
                            </div>
                            {!loading && productsData && (
                                <div data-tour="products-create">
                                    <ProductCreateButton onCreateCallback={handleRefresh} />
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {error ? (
                        <div className="p-6">
                          <ProductsErrorState 
                            message={error}
                            onRetry={handleRetry}
                            isRetrying={loading}
                          />
                        </div>
                    ) : loading ? (
                        <div className="p-6">
                          <ProductsLoadingState count={6} />
                        </div>
                    ) : productsData ? (
                        <div data-tour="products-table">
                            <ProductsClient 
                                productos={productsData.products} 
                                pagination={productsData.pagination} 
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}
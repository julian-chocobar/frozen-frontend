'use client';

import { Header } from "@/components/layout/header"
import { ProductsClient } from "./_components/products-client"
import { ProductsFilters } from "./_components/products-filters"
import { PaginationClient } from "@/components/ui/pagination-client"
import { ErrorState } from "@/components/ui/error-state"
import { ProductCreateButton } from "./_components/create-button"
import { getProducts } from "@/lib/products-api"
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ProductResponse } from "@/types"

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

    // Obtener parámetros de búsqueda
    const page = parseInt(searchParams.get('page') || '0')
    const name = searchParams.get('name') || undefined
    const alcoholic = searchParams.get('alcoholic') || undefined
    const estado = searchParams.get('estado') || undefined
    const ready = searchParams.get('ready') || undefined

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
        const loadProducts = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await getProducts({
                    page,
                    name,
                    alcoholic,
                    estado,
                    ready,
                    size: 10
                })
                setProductsData(data)
            } catch (err) {
                console.error('Error al cargar productos:', err)

                if (err instanceof Error) {
                    if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
                        setError('No se pudo conectar con el backend')
                    } else {
                        setError(err.message)
                    }
                } else {
                    setError('No se pudieron cargar los productos')
                }
            } finally {
                setLoading(false)
            }
        }

        loadProducts()
    }, [page, name, alcoholic, estado, ready, refreshKey])
    return (
        <>
            <Header
                title="Productos"
                subtitle="Gestiona tus productos"
            />
            <div className="p-4 md:p-6 space-y-6">
                {/* Filtros */}
                <ProductsFilters />
                <div className="card border-2 border-primary-600 overflow-hidden">
                    <div className="p-6 border-b border-stroke">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-primary-900 mb-1">Productos</h2>
                                <p className="text-sm text-primary-600">Gestiona tus productos</p>
                            </div>
                            {!loading && productsData && (
                                <ProductCreateButton onCreateCallback={() => setRefreshKey(prev => prev + 1)} />
                            )}
                        </div>
                    </div>
                    
                    {error ? (
                        <ErrorState error={error} />
                    ) : loading ? (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-primary-600">Cargando productos...</p>
                        </div>
                    ) : productsData ? (
                        <ProductsClient 
                            productos={productsData.products} 
                            pagination={productsData.pagination} 
                        />
                    ) : null}
                </div>
            </div>

            {/* Contador de resultados y paginación */}
            {productsData && (
                <div className="text-center space-y-4">
                    <p className="text-sm text-primary-700">
                        Mostrando {productsData.products.length} productos de {productsData.pagination.totalElements} totales
                    </p>
                    <PaginationClient 
                        currentPage={productsData.pagination.currentPage}
                        totalPages={productsData.pagination.totalPages}
                    />
                </div>
            )}
        </>
    )
}
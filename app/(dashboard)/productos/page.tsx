import { Header } from "@/components/layout/header"
import { ProductsClient } from "./_components/products-client"
import { ProductsFilters } from "./_components/products-filters"
import { PaginationClient } from "@/components/ui/pagination-client"
import { ErrorState } from "@/components/ui/error-state"
import { ProductCreateButton } from "./_components/create-button"
import { getProducts } from "@/lib/products-api"

interface ProductosPageProps {
    searchParams: Promise<{
        page?: string
        name?: string
        alcoholic?: string
        estado?: string
        ready?: string
    }>
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
    const params = await searchParams
    const page = parseInt(params.page || '0')
    const name = params.name
    const alcoholic = params.alcoholic
    const estado = params.estado
    const ready = params.ready

    let productsData
    let error: string | null = null

    try {
        productsData = await getProducts({
            page,
            name,
            alcoholic,
            estado,
            ready,
            size: 10
        })
    } catch (err) {
        console.error('Error al cargar productos:', err)

        if (err instanceof Error) {
            if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
                error = 'No se pudo conectar con el backend'
            } else {
                error = err.message
            }
        } else {
            error = 'No se pudieron cargar los productos'
        }
    }
    return (
        <>
            <Header
                title="Productos"
                subtitle="Gestiona tus productos"
                notificationCount={2}
                actionButton={<ProductCreateButton />}
            />
            <div className="p-4 md:p-6 space-y-6">
                {/* Filtros */}
                <ProductsFilters />
                <div className="card border-2 border-primary-600 overflow-hidden">
                    <div className="p-6 border-b border-stroke">
                        <h2 className="text-xl font-semibold text-primary-900 mb-1">Productos</h2>
                        <p className="text-sm text-primary-600">Gestiona tus productos</p>
                    </div>
                    
                    {error ? (
                        <ErrorState error={error} />
                    ) : productsData ? (
                        <ProductsClient 
                            productos={productsData.products} 
                            pagination={productsData.pagination} 
                        />
                    ) : (
                        <div className="p-8 text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                            <p className="mt-4 text-primary-600">Cargando productos...</p>
                        </div>
                    )}
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
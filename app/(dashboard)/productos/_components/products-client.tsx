"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ProductsTable } from "./products-table"
import { ProductsCards } from "./products-cards"
import { ProductForm } from "./product-form"
import { PaginationClient } from "@/components/ui/pagination-client"
import { 
    updateProduct,
    toggleProductActive,
    toogleReady
} from "@/lib/products-api"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { ProductResponse, ProductUpdateRequest } from "@/types"

interface ProductsClientProps {
    productos: ProductResponse[]
    pagination: {
        currentPage: number
        totalPages: number
        totalElements: number
        size: number
        first: boolean
        last: boolean
    }
}

export function ProductsClient({ productos, pagination }: ProductsClientProps) {
    const router = useRouter()
    const [localProducts, setLocalProducts] = useState<ProductResponse[]>(productos)
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Sincronizar con props
    useEffect(() => {
        setLocalProducts(productos)
    }, [productos])

    const handleEdit = async (id: string, data: ProductUpdateRequest) => {
        setIsLoading(true)
        try {
            await updateProduct(id, data)
            setIsEditing(false)
            setSelectedProduct(null)
            showSuccess('Producto actualizado exitosamente')
            setTimeout(() => router.refresh(), 500)
        } catch (error) {
            handleError(error, {
                title: 'Error al actualizar producto'
              })
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleActive = async (product: ProductResponse) => {
        setIsLoading(true)
        try {
            // Actualización optimista
            setLocalProducts(prevProducts => 
                prevProducts.map(p => 
                    p.id === product.id 
                        ? { ...p, isActive: !p.isActive }
                        : p
                )
            )
            
            await toggleProductActive(product.id)
            showSuccess('Producto activado/desactivado exitosamente')
            setTimeout(() => router.refresh(), 500)
        } catch (error) {
            // Revertir en caso de error
            setLocalProducts(prevProducts => 
                prevProducts.map(p => 
                    p.id === product.id 
                        ? { ...p, isActive: product.isActive }
                        : p
                )
            )
            handleError(error, {
                title: 'Error al cambiar estado del producto'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleMarkAsReady = async (product: ProductResponse) => {
        setIsLoading(true)
        try {
            // Actualización optimista
            setLocalProducts(prevProducts => 
                prevProducts.map(p => 
                    p.id === product.id 
                        ? { ...p, isReady: !p.isReady }
                        : p
                )
            )
            
            await toogleReady(product.id)
            const action = product.isReady ? 'desmarcado' : 'marcado'
            showSuccess(`Producto ${action} como listo exitosamente`)
            setTimeout(() => router.refresh(), 500)
        } catch (error) {
            // Revertir en caso de error
            setLocalProducts(prevProducts => 
                prevProducts.map(p => 
                    p.id === product.id 
                        ? { ...p, isReady: product.isReady }
                        : p
                )
            )
            handleError(error, {
                title: 'Error al cambiar estado del producto'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewDetails = (product: ProductResponse) => {
        router.push(`/productos/${product.id}`)
    }

    const handleEditClick = (product: ProductResponse) => {
        setSelectedProduct(product)
        setIsEditing(true)
    }
    return (
        <>
            <ProductsTable 
                productos={localProducts} 
                onEdit={handleEditClick} 
                onToggleActive={handleToggleActive} 
                onViewDetails={handleViewDetails} 
                onMarkAsReady={handleMarkAsReady}
            />
            <ProductsCards 
                productos={localProducts} 
                onEdit={handleEditClick} 
                onToggleActive={handleToggleActive}
                onMarkAsReady={handleMarkAsReady} 
                onViewDetails={handleViewDetails} 
            />
    
            {pagination && (
                <div className="mt-4 border-t border-stroke bg-primary-50/40 px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-primary-700">
                        <p>
                            Mostrando {localProducts.length} productos de {pagination.totalElements} totales
                        </p>
                        <PaginationClient 
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                        />
                    </div>
                </div>
            )}
    
            {/* Modal para editar producto */}
            {isEditing && selectedProduct && (
                <div 
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ 
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                >
                    <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-200">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-primary-900 mb-4">Editar Producto</h2>
                            <ProductForm 
                                product={selectedProduct} 
                                onSubmit={(data) => handleEdit(selectedProduct.id, data as ProductUpdateRequest)} 
                                onCancel={() => {
                                    setIsEditing(false)
                                    setSelectedProduct(null)
                                }}
                                isLoading={isLoading} 
                            />
                        </div>
                    </div>  
                </div>
            )}
        </>
    )
}
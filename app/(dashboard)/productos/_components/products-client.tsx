"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductsTable } from "./products-table"
import { ProductsCards } from "./products-cards"
import { ProductForm } from "./product-form"
import { 
    updateProduct,
    toggleProductActive,
    markProductAsReady
} from "@/lib/products-api"
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

export function ProductsClient({ productos }: ProductsClientProps) {
    const router = useRouter()
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isViewing, setIsViewing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleEdit = async (id: string, data: ProductUpdateRequest) => {
        setIsLoading(true)
        try {
            await updateProduct(id, data)
            router.refresh()
            setIsEditing(false)
            setSelectedProduct(null)
        } catch (error) {
            console.error('Error al actualizar producto:', error)
            alert('Error al actualizar el producto')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleActive = async (product: ProductResponse) => {
        setIsLoading(true)
        try {
            await toggleProductActive(product.id)
            router.refresh()
        } catch (error) {
            console.error('Error al cambiar estado del producto:', error)
            alert('Error al cambiar el estado del producto')
        } finally {
            setIsLoading(false)
        }
    }

    const handleMarkAsReady = async (product: ProductResponse) => {
        setIsLoading(true)
        try {
            await markProductAsReady(product.id)
            router.refresh()
        } catch (error) {
            console.error('Error al marcar como listo el producto:', error)
            alert('Error al marcar como listo el producto')
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewDetails = (product: ProductResponse) => {
        setSelectedProduct(product)
        setIsViewing(true)
    }

    const handleEditClick = (product: ProductResponse) => {
        setSelectedProduct(product)
        setIsEditing(true)
    }
    return (
        <>
            <ProductsTable 
                productos={productos} 
                onEdit={handleEditClick} 
                onToggleActive={handleToggleActive} 
                onViewDetails={handleViewDetails} 
                onMarkAsReady={handleMarkAsReady}
            />
            <ProductsCards 
                productos={productos} 
                onEdit={handleEditClick} 
                onToggleActive={handleToggleActive}
                onMarkAsReady={handleMarkAsReady} 
                onViewDetails={handleViewDetails} 
            />
    
            {/* Modal para editar producto */}
            {isEditing && selectedProduct && (
                <div 
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                >
                    <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>
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
'use client';

import { Header } from "@/components/layout/header"
import { ProductDetailClient } from "@/app/(dashboard)/productos/_components/product-detail-client"
import { ProductsLoadingState } from "@/components/products/products-loading-state"
import { ProductsErrorState } from "@/components/products/products-error-state"
import { getProductById } from "@/lib/products"
import { notFound, useParams } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from 'react'
import { ProductResponse } from "@/types"
import { getAlcoholicText, getActiveText, validateProductData } from "@/lib/products/utils"
import { PRODUCT_ERROR_MESSAGES } from "@/lib/constants"

export default function ProductDetailPage() {
    const params = useParams()
    const id = params.id as string
    
    const [product, setProduct] = useState<ProductResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    // Callback para cargar producto
    const loadProduct = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await getProductById(id)
            
            // Validar datos antes de establecer
            if (!validateProductData(data)) {
                throw new Error(PRODUCT_ERROR_MESSAGES.INVALID_DATA)
            }
            
            setProduct(data)
        } catch (err) {
            console.error('Error al cargar producto:', err)

            if (err instanceof Error) {
                if (err.message.includes('conectar con el backend') || 
                    err.message.includes('ECONNREFUSED') || 
                    err.message.includes('fetch failed')) {
                    setError(PRODUCT_ERROR_MESSAGES.NETWORK_ERROR)
                } else if (err.message.includes('404') || err.message.includes('Not Found')) {
                    notFound()
                } else {
                    setError(err.message)
                }
            } else {
                setError(PRODUCT_ERROR_MESSAGES.FETCH_BY_ID_FAILED)
            }
        } finally {
            setLoading(false)
        }
    }, [id])

    // Cargar producto al montar
    useEffect(() => {
        if (id) {
            loadProduct()
        }
    }, [id, loadProduct])

    // Callback para reintentar
    const handleRetry = useCallback(() => {
        loadProduct()
    }, [loadProduct])

    // Subtítulo memoizado
    const subtitle = useMemo(() => {
        if (!product) return ''
        return `Producto ${getAlcoholicText(product.isAlcoholic)} - ${getActiveText(product.isActive)}`
    }, [product])

    if (error) {
        return (
            <>
                <Header
                    title="Error"
                    subtitle="No se pudo cargar el producto"
                    backButton={{ href: "/productos" }}
                />
                <div className="p-4 md:p-6">
                    <ProductsErrorState 
                      message={error}
                      onRetry={handleRetry}
                      isRetrying={loading}
                    />
                </div>
            </>
        )
    }

    if (loading) {
        return (
            <>
                <Header
                    title="Cargando..."
                    subtitle="Cargando detalles del producto"
                    backButton={{ href: "/productos" }}
                />
                <div className="p-4 md:p-6">
                    <ProductsLoadingState count={1} />
                </div>
            </>
        )
    }

    if (!product) {
        notFound()
        return null
    }

    return (
        <>
            <Header
                title={product.name}
                subtitle={subtitle}
                backButton={{ href: "/productos" }}
            />
            <div className="p-4 md:p-6" data-tour="product-detail-container">
                <ProductDetailClient product={product} />
            </div>
        </>
    )
}

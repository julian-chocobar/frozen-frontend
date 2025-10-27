'use client';

import { Header } from "@/components/layout/header"
import { ProductDetailClient } from "@/app/(dashboard)/productos/_components/product-detail-client"
import { ErrorState } from "@/components/ui/error-state"
import { getProductById } from "@/lib/products-api"
import { notFound, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from 'react'
import { ProductResponse } from "@/types"

export default function ProductDetailPage() {
    const params = useParams()
    const id = params.id as string
    
    const [product, setProduct] = useState<ProductResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadProduct = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await getProductById(id)
                setProduct(data)
            } catch (err) {
                console.error('Error al cargar producto:', err)

                if (err instanceof Error) {
                    if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
                        setError('No se pudo conectar con el backend')
                    } else if (err.message.includes('404') || err.message.includes('Not Found')) {
                        notFound()
                    } else {
                        setError(err.message)
                    }
                } else {
                    setError('No se pudo cargar el producto')
                }
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadProduct()
        }
    }, [id])

    if (error) {
        return (
            <>
                <Header
                    title="Error"
                    subtitle="No se pudo cargar el producto"
                />
                <div className="p-4 md:p-6">
                    <ErrorState error={error} />
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
                />
                <div className="p-4 md:p-6">
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-primary-600">Cargando producto...</p>
                    </div>
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
                subtitle={`Producto ${product.isAlcoholic ? 'Alcohólico' : 'No Alcohólico'} - ${product.isActive ? 'Activo' : 'Inactivo'}`}
            />
            <div className="p-4 md:p-6">
                <div className="mb-6">
                    <Link href="/productos">
                        <Button variant="outline" className="border-primary-300 text-primary-600 hover:bg-primary-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Volver a Productos
                        </Button>
                    </Link>
                </div>
                <ProductDetailClient product={product} />
            </div>
        </>
    )
}

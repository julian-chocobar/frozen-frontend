import { Header } from "@/components/layout/header"
import { ProductDetailClient } from "@/app/(dashboard)/productos/_components/product-detail-client"
import { ErrorState } from "@/components/ui/error-state"
import { getProductById } from "@/lib/products-api"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ProductDetailPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params
    
    let product
    let error: string | null = null

    try {
        product = await getProductById(id)
    } catch (err) {
        console.error('Error al cargar producto:', err)

        if (err instanceof Error) {
            if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
                error = 'No se pudo conectar con el backend'
            } else if (err.message.includes('404') || err.message.includes('Not Found')) {
                notFound()
            } else {
                error = err.message
            }
        } else {
            error = 'No se pudo cargar el producto'
        }
    }

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

    if (!product) {
        notFound()
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

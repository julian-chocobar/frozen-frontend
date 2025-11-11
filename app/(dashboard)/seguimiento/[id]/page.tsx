'use client';

/**
 * Página de detalle de lote
 * Muestra información completa de un lote específico con sus fases y parámetros de calidad
 */

import { Header } from "@/components/layout/header"
import { BatchDetailClient } from "@/app/(dashboard)/seguimiento/_components/batch-detail-client"
import { ErrorState } from "@/components/ui/error-state"
import { getBatchById } from "@/lib/batches-api"
import { notFound, useParams } from "next/navigation"
import { useEffect, useState } from 'react'
import { BatchResponse } from "@/types"

const statusStyles: Record<string, string> = {
    "Completado": "bg-green-100 text-green-800 border border-green-200",
    "En Producción": "bg-primary-100 text-primary-700 border border-primary-300",
    "Pendiente": "bg-amber-100 text-amber-700 border border-amber-200",
    "Cancelado": "bg-red-100 text-red-700 border border-red-200",
    "En Espera": "bg-sky-100 text-sky-700 border border-sky-200",
    default: "bg-primary-50 text-primary-700 border border-primary-200"
}

export default function BatchDetailPage() {
    const params = useParams()
    const id = params.id as string
    
    const [batch, setBatch] = useState<BatchResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadBatch = async () => {
            setLoading(true)
            setError(null)

            try {
                const data = await getBatchById(id)
                setBatch(data)
            } catch (err) {
                console.error('Error al cargar lote:', err)

                if (err instanceof Error) {
                    if (err.message.includes('conectar con el backend') || err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed')) {
                        setError('No se pudo conectar con el backend')
                    } else if (err.message.includes('404') || err.message.includes('Not Found')) {
                        notFound()
                    } else {
                        setError(err.message)
                    }
                } else {
                    setError('No se pudo cargar el lote')
                }
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            loadBatch()
        }
    }, [id])

    if (loading) {
        return (
            <>
                <Header 
                    title="Cargando..." 
                    subtitle="Obteniendo detalles del lote"
                    backButton={{ href: "/seguimiento" }}
                />
                
                <div className="p-4 md:p-6">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                        <p className="mt-4 text-primary-600">Cargando detalles del lote...</p>
                    </div>
                </div>
            </>
        )
    }

    if (error) {
        return (
            <>
                <Header 
                    title="Error" 
                    subtitle="No se pudo cargar el lote"
                    backButton={{ href: "/seguimiento" }}
                />
                
                <div className="p-4 md:p-6">
                    <ErrorState error={error} />
                </div>
            </>
        )
    }

    if (!batch) {
        return null
    }

    return (
        <>
            <Header 
                title={`Lote ${batch.code}`} 
                subtitle={batch.productName}
                backButton={{ href: "/seguimiento" }}
            />
            
            <div className="p-4 md:p-6 space-y-6">
                {/* Información básica del lote */}
                <div className="card border-2 border-primary-600 p-6">
                    <h2 className="text-xl font-semibold text-primary-900 mb-4">Información del Lote</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Código</p>
                            <p className="text-lg font-bold font-mono text-primary-900">{batch.code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Orden de Producción</p>
                            <p className="text-lg font-bold font-mono text-primary-900">{batch.orderId}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Producto</p>
                            <p className="text-lg font-semibold text-primary-900">{batch.productName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Empaque</p>
                            <p className="text-lg text-primary-900">{batch.packagingName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Cantidad</p>
                            <p className="text-lg font-bold text-primary-900">{batch.quantity} unidades</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Estado</p>
                            <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                                statusStyles[batch.status] ?? statusStyles.default
                            }`}>
                                {batch.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Fechas importantes */}
                <div className="card border-2 border-primary-600 p-6">
                    <h2 className="text-xl font-semibold text-primary-900 mb-4">Cronología</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Creación</p>
                            <p className="text-lg text-primary-900">{new Date(batch.creationDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Planificada</p>
                            <p className="text-lg text-primary-900">{new Date(batch.plannedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Inicio</p>
                            <p className="text-lg text-primary-900">{batch.startDate ? new Date(batch.startDate).toLocaleDateString() : "Pendiente"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Estimada Fin</p>
                            <p className="text-lg text-primary-900">{new Date(batch.estimatedCompletedDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>

                {/* Componente para fases de producción y calidad */}
                <BatchDetailClient batchId={batch.id} />
            </div>
        </>
    )
}
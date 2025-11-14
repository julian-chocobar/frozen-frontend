'use client';

/**
 * Página de detalle de lote
 * Muestra información completa de un lote específico con sus fases y parámetros de calidad
 */

import { Header } from "@/components/layout/header"
import { BatchDetailClient } from "@/app/(dashboard)/seguimiento/_components/batch-detail-client"
import { OrderDetails } from "@/app/(dashboard)/ordenes/_components/order-details"
import { ErrorState } from "@/components/ui/error-state"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getBatchById, getBatchTraceabilityPdf, cancelBatch } from "@/lib/batches-api"
import { getProductionOrderById } from "@/lib/production-orders-api"
import { notFound, useParams, useRouter } from "next/navigation"
import { useEffect, useState } from 'react'
import { BatchResponse, ProductionOrderResponse } from "@/types"
import { FileText, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const statusStyles: Record<string, string> = {
    "PENDIENTE": "bg-gray-100 text-gray-700 border border-gray-300",
    "EN_PRODUCCION": "bg-blue-100 text-blue-700 border border-blue-300",
    "EN_ESPERA": "bg-yellow-100 text-yellow-700 border border-yellow-300",
    "COMPLETADO": "bg-green-100 text-green-700 border border-green-300",
    "CANCELADO": "bg-red-100 text-red-700 border border-red-300",
    default: "bg-gray-100 text-gray-700 border border-gray-300"
}

export default function BatchDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const id = params.id as string
    
    const [batch, setBatch] = useState<BatchResponse | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState<ProductionOrderResponse | null>(null)
    const [isViewingOrder, setIsViewingOrder] = useState(false)
    const [loadingOrder, setLoadingOrder] = useState(false)
    const [showCancelDialog, setShowCancelDialog] = useState(false)
    const [isCancelling, setIsCancelling] = useState(false)
    const [isDownloadingPdf, setIsDownloadingPdf] = useState(false)

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

    const handleDownloadReport = async () => {
        if (!batch) return
        
        setIsDownloadingPdf(true)
        try {
            const blob = await getBatchTraceabilityPdf(batch.id)
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `reporte-trazabilidad-${batch.code}.pdf`
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            
            toast({
                title: "Reporte descargado",
                description: "El reporte PDF se ha descargado correctamente.",
            })
        } catch (err) {
            console.error('Error al descargar reporte:', err)
            toast({
                title: "Error al descargar reporte",
                description: err instanceof Error ? err.message : "No se pudo descargar el reporte PDF.",
                variant: "destructive",
            })
        } finally {
            setIsDownloadingPdf(false)
        }
    }

    const handleCancelBatch = async () => {
        if (!batch) return
        
        setIsCancelling(true)
        try {
            await cancelBatch(batch.id)
            toast({
                title: "Lote cancelado",
                description: "El lote ha sido cancelado correctamente.",
            })
            setShowCancelDialog(false)
            // Recargar los datos del lote
            const updatedBatch = await getBatchById(id)
            setBatch(updatedBatch)
            // Opcional: redirigir a la lista de lotes
            // router.push('/seguimiento')
        } catch (err) {
            console.error('Error al cancelar lote:', err)
            toast({
                title: "Error al cancelar lote",
                description: err instanceof Error ? err.message : "No se pudo cancelar el lote.",
                variant: "destructive",
            })
        } finally {
            setIsCancelling(false)
        }
    }

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
                    <div className="flex items-start justify-between mb-4">
                        <h2 className="text-xl font-semibold text-primary-900">Información del Lote</h2>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleDownloadReport}
                                disabled={isDownloadingPdf}
                                variant="outline"
                                size="sm"
                                className="gap-2 border-primary-600 text-primary-600 hover:bg-primary-50"
                            >
                                {isDownloadingPdf ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Descargando...
                                    </>
                                ) : (
                                    <>
                                        <FileText className="w-4 h-4" />
                                        Reporte
                                    </>
                                )}
                            </Button>
                            <Button
                                onClick={() => setShowCancelDialog(true)}
                                disabled={batch.status === "CANCELADO" || isCancelling}
                                variant="outline"
                                size="sm"
                                className="gap-2 border-red-600 text-red-600 hover:bg-red-50 disabled:border-primary-200 disabled:text-primary-300"
                            >
                                <XCircle className="w-4 h-4" />
                                Cancelar
                            </Button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Código</p>
                            <p className="text-lg font-bold font-mono text-primary-900">{batch.code}</p>
                        </div>
                        <div>
                            <p className="text-sm text-primary-600 font-medium">Orden de Producción</p>
                            <button
                                onClick={async () => {
                                    if (!batch.orderId) return
                                    setIsViewingOrder(true)
                                    setLoadingOrder(true)
                                    try {
                                        const orderData = await getProductionOrderById(batch.orderId)
                                        setSelectedOrder(orderData)
                                    } catch (err) {
                                        console.error('Error al cargar orden:', err)
                                        setError('No se pudo cargar la orden de producción')
                                        setIsViewingOrder(false)
                                    } finally {
                                        setLoadingOrder(false)
                                    }
                                }}
                                className="text-lg font-bold font-mono text-primary-600 hover:text-primary-700 hover:underline transition-colors cursor-pointer text-left"
                            >
                                {batch.orderId}
                            </button>
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
                        {batch.completedDate && (
                            <div>
                                <p className="text-sm text-primary-600 font-medium">Fin Real</p>
                                <p className="text-lg text-primary-900">{new Date(batch.completedDate).toLocaleDateString()}</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Componente para fases de producción y calidad */}
                <BatchDetailClient 
                    batchId={batch.id} 
                    productId={batch.productId}
                    onBatchUpdate={async () => {
                        // Recargar los datos del lote cuando cambie el estado
                        try {
                            const updatedBatch = await getBatchById(id)
                            setBatch(updatedBatch)
                        } catch (err) {
                            console.error('Error al actualizar lote:', err)
                        }
                    }}
                />
            </div>

            {/* Modal para ver detalles de la orden */}
            {isViewingOrder && selectedOrder && (
                <div 
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ 
                        backgroundColor: 'rgba(37, 99, 235, 0.08)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                >
                    <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-primary-600">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-primary-900">Detalles de la Orden</h2>
                                <button
                                    onClick={() => {
                                        setIsViewingOrder(false)
                                        setSelectedOrder(null)
                                    }}
                                    className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            {loadingOrder ? (
                                <div className="text-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                                    <p className="mt-4 text-primary-600">Cargando detalles de la orden...</p>
                                </div>
                            ) : (
                                <OrderDetails
                                    order={selectedOrder}
                                    onClose={() => {
                                        setIsViewingOrder(false)
                                        setSelectedOrder(null)
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Diálogo de confirmación para cancelar lote */}
            <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmar cancelación de lote</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas cancelar el lote <strong>{batch?.code}</strong>? 
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowCancelDialog(false)}
                            disabled={isCancelling}
                            className="border-primary-300 text-primary-700 hover:bg-primary-50"
                        >
                            No, mantener lote
                        </Button>
                        <Button
                            onClick={handleCancelBatch}
                            disabled={isCancelling}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isCancelling ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Cancelando...
                                </>
                            ) : (
                                "Sí, cancelar lote"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
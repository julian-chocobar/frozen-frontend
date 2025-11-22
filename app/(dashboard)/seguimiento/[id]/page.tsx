'use client';

/**
 * Página de detalle de lote
 * Muestra información completa de un lote específico con sus fases y parámetros de calidad
 */

import { Header } from "@/components/layout/header"
import { BatchDetailClient } from "@/app/(dashboard)/seguimiento/_components/batch-detail-client"
import { OrderDetails } from "@/app/(dashboard)/ordenes/_components/order-details"
import { BatchesLoadingState } from "@/components/batches/batches-loading-state"
import { BatchesErrorState } from "@/components/batches/batches-error-state"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getBatchById, getBatchTraceabilityPdf, cancelBatch } from "@/lib/batches"
import { getBatchStatusText, getBatchStatusBadgeConfig, validateBatchData, canCancelBatch, getBatchStatusColor } from "@/lib/batches/utils"
import { getProductionOrderById } from "@/lib/orders"
import { notFound, useParams, useRouter } from "next/navigation"
import { useEffect, useState, useCallback, useMemo } from 'react'
import { BatchResponse, ProductionOrderResponse } from "@/types"
import { FileText, XCircle, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  BATCH_ERROR_MESSAGES, 
  BATCH_SUCCESS_MESSAGES 
} from "@/lib/constants"



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

    // Callback para cargar lote
    const loadBatch = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const data = await getBatchById(id)
            
            // Validar datos antes de establecer
            if (!validateBatchData(data)) {
                throw new Error(BATCH_ERROR_MESSAGES.INVALID_DATA)
            }
            
            setBatch(data)
        } catch (err) {
            console.error('Error al cargar lote:', err)

            if (err instanceof Error) {
                if (err.message.includes('conectar con el backend') || 
                    err.message.includes('ECONNREFUSED') || 
                    err.message.includes('fetch failed')) {
                    setError(BATCH_ERROR_MESSAGES.NETWORK_ERROR)
                } else if (err.message.includes('404') || err.message.includes('Not Found')) {
                    notFound()
                } else {
                    setError(err.message)
                }
            } else {
                setError(BATCH_ERROR_MESSAGES.FETCH_BY_ID_FAILED)
            }
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        if (id) {
            loadBatch()
        }
    }, [id, loadBatch])

    // Callback para descargar reporte PDF
    const handleDownloadReport = useCallback(async () => {
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
                description: BATCH_SUCCESS_MESSAGES.PDF_DOWNLOADED,
            })
        } catch (err) {
            console.error('Error al descargar reporte:', err)
            toast({
                title: "Error al descargar reporte",
                description: err instanceof Error ? err.message : BATCH_ERROR_MESSAGES.PDF_FAILED,
                variant: "destructive",
            })
        } finally {
            setIsDownloadingPdf(false)
        }
    }, [batch, toast])

    // Callback para cancelar lote
    const handleCancelBatch = useCallback(async () => {
        if (!batch || !canCancelBatch(batch)) {
            toast({
                title: "No se puede cancelar",
                description: BATCH_ERROR_MESSAGES.CANNOT_CANCEL,
                variant: "destructive",
            })
            return
        }
        
        setIsCancelling(true)
        try {
            await cancelBatch(batch.id)
            toast({
                title: "Lote cancelado",
                description: BATCH_SUCCESS_MESSAGES.CANCELLED,
            })
            setShowCancelDialog(false)
            // Recargar los datos del lote
            await loadBatch()
        } catch (err) {
            console.error('Error al cancelar lote:', err)
            toast({
                title: "Error al cancelar lote",
                description: err instanceof Error ? err.message : BATCH_ERROR_MESSAGES.CANCEL_FAILED,
                variant: "destructive",
            })
        } finally {
            setIsCancelling(false)
        }
    }, [batch, toast, loadBatch])

    // Subtítulo memoizado
    const subtitle = useMemo(() => {
        if (!batch) return ''
        return `${batch.productName || 'Producto'} - ${getBatchStatusText(batch.status)}`
    }, [batch])

    // Callback para reintentar
    const handleRetry = useCallback(() => {
        loadBatch()
    }, [loadBatch])

    if (loading) {
        return (
            <>
                <Header 
                    title="Cargando..." 
                    subtitle="Obteniendo detalles del lote"
                    backButton={{ href: "/seguimiento" }}
                />
                
                <div className="p-4 md:p-6">
                    <BatchesLoadingState count={1} variant="default" />
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
                    <BatchesErrorState 
                        message={error}
                        onRetry={handleRetry}
                        isRetrying={loading}
                    />
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
                subtitle={subtitle}
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
                                disabled={batch.status === "CANCELADO" || batch.status === "COMPLETADO" || isCancelling}
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
                                getBatchStatusColor(batch.status).bg
                            } ${getBatchStatusColor(batch.status).text} ${getBatchStatusColor(batch.status).border}`}>
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
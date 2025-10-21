"use client"

import { ProductResponse } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle } from "lucide-react"

interface ProductInfoCardProps {
    product: ProductResponse
    onToggleReady: () => void
    allPhasesReady: boolean
    phasesCount: number
    readyPhasesCount: number
    recipesCount: number
}

export function ProductInfoCard({ 
    product, 
    onToggleReady, 
    allPhasesReady, 
    phasesCount, 
    readyPhasesCount, 
    recipesCount 
}: ProductInfoCardProps) {
    return (
        <Card className="p-4 md:p-6 border-2 border-primary-600">
            {/* Header responsive: vertical en móvil, horizontal en desktop */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                <div className="flex-1">
                    <h1 className="text-xl md:text-2xl font-bold text-primary-900 mb-2">{product.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-4">
                        <Badge variant={product.isAlcoholic ? "default" : "secondary"}>
                            {product.isAlcoholic ? "Alcohólico" : "No Alcohólico"}
                        </Badge>
                        <Badge variant={product.isActive ? "default" : "destructive"}>
                            {product.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <Badge variant={product.isReady ? "default" : "secondary"}>
                            {product.isReady ? "Listo" : "No Listo"}
                        </Badge>
                    </div>
                </div>
                {/* Botón responsive con texto visible */}
                <div className="w-full md:w-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onToggleReady}
                        disabled={!allPhasesReady && !product.isReady}
                        className="w-full md:w-auto text-xs md:text-sm"
                    >
                        {product.isReady ? (
                            <>
                                <XCircle className="w-4 h-4 mr-1.5 md:mr-2" />
                                <span>No Listo</span>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-1.5 md:mr-2" />
                                <span>Listo</span>
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Información del producto */}
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-primary-900 mb-3 md:mb-4">Información del Producto</h3>
                    <div className="space-y-2 md:space-y-3">
                        <div>
                            <span className="text-xs md:text-sm font-medium text-primary-600">Cantidad Estándar:</span>
                            <p className="text-base md:text-lg font-semibold text-primary-900">
                                {product.standardQuantity} {product.unitMeasurement}
                            </p>
                        </div>
                        <div>
                            <span className="text-xs md:text-sm font-medium text-primary-600">Fecha de Creación:</span>
                            <p className="text-base md:text-lg font-semibold text-primary-900">
                                {new Date(product.creationDate).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Estado del producto - responsive grid */}
                <div>
                    <h3 className="text-base md:text-lg font-semibold text-primary-900 mb-3 md:mb-4">Estado del Producto</h3>
                    <div className="grid grid-cols-3 gap-2 md:gap-3">
                        <div className="text-center p-2 md:p-3 bg-primary-50 rounded-lg border border-primary-200">
                            <div className="text-lg md:text-xl font-bold text-primary-600">{phasesCount}</div>
                            <div className="text-[10px] md:text-xs text-primary-600 leading-tight">Fases Totales</div>
                        </div>
                        <div className="text-center p-2 md:p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-lg md:text-xl font-bold text-green-600">{readyPhasesCount}</div>
                            <div className="text-[10px] md:text-xs text-green-600 leading-tight">Fases Listas</div>
                        </div>
                        <div className="text-center p-2 md:p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-lg md:text-xl font-bold text-blue-600">{recipesCount}</div>
                            <div className="text-[10px] md:text-xs text-blue-600 leading-tight">Recetas Totales</div>
                        </div>
                    </div>
                </div>
            </div>

            {!allPhasesReady && !product.isReady && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <XCircle className="w-5 h-5 text-yellow-600 mr-2" />
                        <p className="text-sm text-yellow-800">
                            El producto no puede marcarse como listo hasta que todas las fases estén completas.
                        </p>
                    </div>
                </div>
            )}
        </Card>
    )
}

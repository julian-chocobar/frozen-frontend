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
        <Card className="p-6 border-2 border-primary-600">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary-900 mb-2">{product.name}</h1>
                    <div className="flex items-center gap-2 mb-4">
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
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onToggleReady}
                        disabled={!allPhasesReady && !product.isReady}
                    >
                        {product.isReady ? (
                            <>
                                <XCircle className="w-4 h-4 mr-2" />
                                Marcar No Listo
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Marcar Listo
                            </>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Información del producto */}
                <div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-4">Información del Producto</h3>
                    <div className="space-y-3">
                        <div>
                            <span className="text-sm font-medium text-primary-600">Cantidad Estándar:</span>
                            <p className="text-lg font-semibold text-primary-900">
                                {product.standardQuantity} {product.unitMeasurement}
                            </p>
                        </div>
                        <div>
                            <span className="text-sm font-medium text-primary-600">Fecha de Creación:</span>
                            <p className="text-lg font-semibold text-primary-900">
                                {new Date(product.creationDate).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Estado del producto */}
                <div>
                    <h3 className="text-lg font-semibold text-primary-900 mb-4">Estado del Producto</h3>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 bg-primary-50 rounded-lg border border-primary-200">
                            <div className="text-xl font-bold text-primary-600">{phasesCount}</div>
                            <div className="text-xs text-primary-600">Fases Totales</div>
                        </div>
                        <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                            <div className="text-xl font-bold text-green-600">{readyPhasesCount}</div>
                            <div className="text-xs text-green-600">Fases Listas</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="text-xl font-bold text-blue-600">{recipesCount}</div>
                            <div className="text-xs text-blue-600">Recetas Totales</div>
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

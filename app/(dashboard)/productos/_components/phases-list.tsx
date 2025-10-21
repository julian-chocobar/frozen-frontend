"use client"

import { ProductPhaseResponse, RecipeResponse } from "@/types"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Edit, Plus, Loader2, Trash2 } from "lucide-react"

interface PhasesListProps {
    phases: ProductPhaseResponse[]
    recipesByPhase: Record<string, RecipeResponse[]>
    onEditPhase: (phaseId: string) => void
    onCreateRecipe: (phaseId: string) => void
    onTogglePhaseReady: (phaseId: string, isReady: boolean) => void
    onEditRecipe: (recipe: RecipeResponse) => void
    onDeleteRecipe: (recipeId: string) => void
    updatingPhase: string | null
}

export function PhasesList({ 
    phases, 
    recipesByPhase, 
    onEditPhase, 
    onCreateRecipe, 
    onTogglePhaseReady,
    onEditRecipe,
    onDeleteRecipe,
    updatingPhase 
}: PhasesListProps) {
    const getRecipesByPhase = (phaseId: string) => {
        return recipesByPhase[phaseId] || []
    }

    const getPhaseLabel = (phase: string) => {
        const labels: Record<string, string> = {
            'MOLIENDA': 'Molienda',
            'MACERACION': 'Maceración',
            'FILTRACION': 'Filtración',
            'COCCION': 'Cocción',
            'FERMENTACION': 'Fermentación',
            'MADURACION': 'Maduración',
            'GASIFICACION': 'Gasificación',
            'ENVASADO': 'Envasado',
            'DESALCOHOLIZACION': 'Desalcoholización',
        }
        return labels[phase] || phase
    }

    return (
        <Card className="p-6 border-2 border-primary-600">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-primary-900">Fases del Producto</h2>
                <Badge variant="outline" className="border-primary-600 text-primary-600">
                    {phases.filter(p => p.isReady).length} de {phases.length} listas
                </Badge>
            </div>

            <div className="space-y-4">
                {phases.map((phase, index) => {
                    const phaseRecipes = getRecipesByPhase(phase.id)
                    const isUpdating = updatingPhase === phase.id
                    const isLastPhase = index === phases.length - 1

                    return (
                        <div key={phase.id} className="relative">
                            {/* Conector visual entre fases */}
                            {!isLastPhase && (
                                <div className="absolute left-6 top-16 w-0.5 h-8 bg-primary-300 z-0"></div>
                            )}
                            
                            <div
                                className={`relative border-2 rounded-lg p-4 hover:shadow-sm transition-all duration-200 ${
                                    phase.isReady 
                                        ? 'border-green-500 bg-green-50' 
                                        : 'border-primary-300 bg-white hover:border-primary-400'
                                }`}
                            >
                                <div className="space-y-4 mb-3">
                                    {/* Header con título y botones - siempre en la misma línea */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                                            {/* Indicador de fase */}
                                            <div className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-bold ${
                                                phase.isReady 
                                                    ? 'bg-green-500 text-white' 
                                                    : 'bg-primary-100 text-primary-600'
                                            }`}>
                                                {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base sm:text-lg font-semibold text-primary-900 truncate">
                                                    {getPhaseLabel(phase.phase)}
                                                </h3>
                                                <Badge variant={phase.isReady ? "default" : "secondary"} className="mt-1">
                                                    {phase.isReady ? "Lista" : "Pendiente"}
                                                </Badge>
                                            </div>
                                        </div>

                                        {/* Botones - solo iconos en móvil, con texto en pantallas grandes */}
                                        <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEditPhase(phase.id)}
                                                className="border-primary-300 text-primary-600 hover:bg-primary-50 h-8 px-2 lg:px-3"
                                                title="Editar fase"
                                            >
                                                <Edit className="w-4 h-4 lg:mr-1" />
                                                <span className="hidden lg:inline">Editar</span>
                                            </Button>
                                            
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onCreateRecipe(phase.id)}
                                                className="border-primary-300 text-primary-600 hover:bg-primary-50 h-8 px-2 lg:px-3"
                                                title="Agregar ingrediente"
                                            >
                                                <Plus className="w-4 h-4 lg:mr-1" />
                                                <span className="hidden lg:inline">Agregar</span>
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onTogglePhaseReady(phase.id, !phase.isReady)}
                                                className={`${phase.isReady ? "bg-yellow-200 hover:bg-yellow-300" : "bg-blue-200 hover:bg-blue-300"} h-8 px-2 lg:px-3`}
                                                title={phase.isReady ? "Marcar como no lista" : "Marcar como lista"}
                                            >
                                                <CheckCircle className="w-4 h-4 lg:mr-1" />
                                                <span className="hidden lg:inline">{phase.isReady ? "No lista" : "Lista"}</span>
                                            </Button>
                                        </div>
                                    </div>
                                    
                                    {/* Grid de información */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm ml-0 sm:ml-11">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-primary-600 flex-shrink-0">Entrada:</span>
                                            <span className="font-medium text-primary-900 truncate">{phase.input}</span>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-primary-600 flex-shrink-0">Salida:</span>
                                            <span className="font-medium text-primary-900 truncate">
                                                {phase.output} {phase.outputUnit}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="text-primary-600 flex-shrink-0">Horas:</span>
                                            <span className="font-medium text-primary-900">{phase.estimatedHours}h</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Recetas de la fase */}
                                {phaseRecipes.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-primary-200 ml-0 sm:ml-11">
                                        <h4 className="text-sm font-medium text-primary-600 mb-3">
                                            Ingredientes ({phaseRecipes.length})
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2">
                                            {phaseRecipes.map((recipe) => (
                                                <div
                                                    key={recipe.id}
                                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 bg-primary-50 border border-primary-200 rounded-lg text-sm"
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <span className="font-medium text-primary-900 truncate">
                                                                {recipe.materialName}
                                                            </span>
                                                            <span className="text-primary-600 flex-shrink-0">
                                                                ({recipe.materialCode})
                                                            </span>
                                                        </div>
                                                        <div className="text-primary-700 font-medium mt-1">
                                                            {recipe.quantity} {recipe.materialUnit}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 justify-end sm:justify-start flex-shrink-0">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => onEditRecipe(recipe)}
                                                            className="h-8 w-8 p-0 border-primary-300 text-primary-600 hover:bg-primary-50"
                                                        >
                                                            <Edit className="w-3 h-3" />
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => onDeleteRecipe(recipe.id)}
                                                            className="h-8 w-8 p-0 border-red-300 text-red-600 hover:bg-red-50"
                                                        >
                                                            <Trash2 className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {phaseRecipes.length === 0 && (
                                    <div className="mt-4 pt-4 border-t border-primary-200 ml-0 sm:ml-11">
                                        <div className="text-center py-4 text-primary-600">
                                            <p className="text-sm">No hay ingredientes agregados a esta fase</p>
                                            <p className="text-xs mt-1">Agrega al menos un ingrediente para poder marcar la fase como lista</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {phases.length === 0 && (
                <div className="text-center py-8 text-primary-600">
                    <p>No hay fases configuradas para este producto</p>
                </div>
            )}
        </Card>
    )
}

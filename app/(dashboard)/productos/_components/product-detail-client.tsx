"use client"

import { useState, useEffect } from "react"
import { ProductResponse, ProductPhaseResponse, RecipeResponse, Phase } from "@/types"
import { getProductPhasesByProductId, toggleReady, toggleReady as toglePhaseReady } from "@/lib/product-phases-api"
import { getRecipesByProductPhaseId, updateRecipe, deleteRecipe } from "@/lib/recipes-api"
import { toogleReady as toogleProductReady } from "@/lib/products-api"
import { handleError, showSuccess } from "@/lib/error-handler"
import { ProductInfoCard } from "@/app/(dashboard)/productos/_components/product-info-card"
import { PhasesList } from "@/app/(dashboard)/productos/_components/phases-list"
import { RecipeForm } from "@/app/(dashboard)/productos/_components/recipe-form"
import { RecipeEditForm } from "@/app/(dashboard)/productos/_components/recipe-edit-form"
import { PhaseForm } from "@/app/(dashboard)/productos/_components/phase-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Edit, Plus, Loader2 } from "lucide-react"

interface ProductDetailClientProps {
    product: ProductResponse
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
    const [phases, setPhases] = useState<ProductPhaseResponse[]>([])
    const [recipesByPhase, setRecipesByPhase] = useState<Record<string, RecipeResponse[]>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [editingPhase, setEditingPhase] = useState<string | null>(null)
    const [creatingRecipe, setCreatingRecipe] = useState<string | null>(null)
    const [editingRecipe, setEditingRecipe] = useState<RecipeResponse | null>(null)
    const [updatingPhase, setUpdatingPhase] = useState<string | null>(null)

    // Cargar fases y recetas del producto
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true)
                const phasesData = await getProductPhasesByProductId(product.id)
                setPhases(phasesData)
                
                // Cargar recetas para cada fase
                const recipesMap: Record<string, RecipeResponse[]> = {}
                for (const phase of phasesData) {
                    try {
                        const recipes = await getRecipesByProductPhaseId(phase.id)
                        recipesMap[phase.id] = recipes
                    } catch (err) {
                        console.error(`Error al cargar recetas para fase ${phase.id}:`, err)
                        recipesMap[phase.id] = []
                    }
                }
                setRecipesByPhase(recipesMap)
            } catch (err) {
                console.error('Error al cargar datos:', err)
                setError(err instanceof Error ? err.message : 'Error al cargar datos')
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [product.id])

    // Función para cambiar estado de fase (listo/no listo)
    const handleTogglePhaseReady = async (phaseId: string, isReady: boolean) => {
        try {
            setUpdatingPhase(phaseId)
            await toggleReady(phaseId)
            
            // Recargar fases para actualizar estado
            const updatedPhases = await getProductPhasesByProductId(product.id)
            setPhases(updatedPhases)
            
            const action = isReady ? 'marcada como no lista' : 'marcada como lista'
            showSuccess(`Fase ${action} exitosamente`)
        } catch (error) {
            handleError(error, {
                title: 'Error al cambiar estado de la fase'
            })
        } finally {
            setUpdatingPhase(null)
        }
    }

    // Función para eliminar receta
    const handleDeleteRecipe = async (recipeId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este ingrediente?')) {
            return
        }

        try {
            await deleteRecipe(recipeId)
            showSuccess('Ingrediente eliminado exitosamente')
            refreshData()
        } catch (error) {
            handleError(error, {
                title: 'Error al eliminar ingrediente'
            })
        }
    }

    // Función para cambiar estado del producto (listo/no listo)
    const handleToggleProductReady = async () => {
        try {
            await toogleProductReady(product.id)
            
            const action = product.isReady ? 'marcado como no listo' : 'marcado como listo'
            showSuccess(`Producto ${action} exitosamente`)
            
            // Recargar página para reflejar cambios
            window.location.reload()
        } catch (error) {
            handleError(error, {
                title: 'Error al cambiar estado del producto'
            })
        }
    }

    // Función para recargar datos después de cambios
    const refreshData = async () => {
        try {
            const phasesData = await getProductPhasesByProductId(product.id)
            setPhases(phasesData)
            
            // Recargar recetas para cada fase
            const recipesMap: Record<string, RecipeResponse[]> = {}
            for (const phase of phasesData) {
                try {
                    const recipes = await getRecipesByProductPhaseId(phase.id)
                    recipesMap[phase.id] = recipes
                } catch (err) {
                    console.error(`Error al recargar recetas para fase ${phase.id}:`, err)
                    recipesMap[phase.id] = []
                }
            }
            setRecipesByPhase(recipesMap)
        } catch (err) {
            console.error('Error al recargar datos:', err)
        }
    }

    // Obtener recetas por fase
    const getRecipesByPhase = (phaseId: string) => {
        return recipesByPhase[phaseId] || []
    }

    // Verificar si todas las fases están listas
    const allPhasesReady = phases.length > 0 && phases.every(phase => phase.isReady)

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
                <span className="ml-2 text-primary-600">Cargando datos del producto...</span>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="p-6">
                <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar datos</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                        Reintentar
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Información del producto unificada */}
            <ProductInfoCard 
                product={product} 
                onToggleReady={handleToggleProductReady}
                allPhasesReady={allPhasesReady}
                phasesCount={phases.length}
                readyPhasesCount={phases.filter(p => p.isReady).length}
                recipesCount={Object.values(recipesByPhase).flat().length}
            />

            {/* Lista de fases */}
            <PhasesList 
                phases={phases}
                recipesByPhase={recipesByPhase}
                onEditPhase={setEditingPhase}
                onCreateRecipe={setCreatingRecipe}
                onTogglePhaseReady={handleTogglePhaseReady}
                onEditRecipe={setEditingRecipe}
                onDeleteRecipe={handleDeleteRecipe}
                updatingPhase={updatingPhase}
            />

            {/* Formulario de edición de fase */}
            {editingPhase && (
                <PhaseForm
                    phase={phases.find(p => p.id === editingPhase)!}
                    onSave={() => {
                        setEditingPhase(null)
                        refreshData()
                    }}
                    onCancel={() => setEditingPhase(null)}
                />
            )}

            {/* Formulario de creación de receta */}
            {creatingRecipe && (
                <RecipeForm
                    phase={phases.find(p => p.id === creatingRecipe)!}
                    onSave={() => {
                        setCreatingRecipe(null)
                        refreshData()
                    }}
                    onCancel={() => setCreatingRecipe(null)}
                />
            )}

            {/* Formulario de edición de receta */}
            {editingRecipe && (
                <RecipeEditForm
                    recipe={editingRecipe}
                    phase={phases.find(p => p.id === editingRecipe.productPhaseId)?.phase as Phase}
                    onSave={() => {
                        setEditingRecipe(null)
                        refreshData()
                    }}
                    onCancel={() => setEditingRecipe(null)}
                />
            )}
        </div>
    )
}

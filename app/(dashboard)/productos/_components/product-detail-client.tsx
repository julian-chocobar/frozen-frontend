"use client"

import { useState, useEffect } from "react"
import { ProductResponse, ProductPhaseResponse, RecipeResponse, Phase } from "@/types"
import { getProductPhasesByProductId } from "@/lib/product-phases-api"
import { getRecipesByProductPhaseId, updateRecipe, deleteRecipe } from "@/lib/recipes-api"
import { markProductPhaseAsReady } from "@/lib/product-phases-api"
import { markProductAsReady } from "@/lib/products-api"
import { ProductInfoCard } from "@/app/(dashboard)/productos/_components/product-info-card"
import { PhasesList } from "@/app/(dashboard)/productos/_components/phases-list"
import { RecipeForm } from "@/app/(dashboard)/productos/_components/recipe-form"
import { RecipeEditForm } from "@/app/(dashboard)/productos/_components/recipe-edit-form"
import { PhaseForm } from "@/app/(dashboard)/productos/_components/phase-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Edit, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

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

    // Función para marcar fase como lista
    const handleMarkPhaseReady = async (phaseId: string) => {
        try {
            setUpdatingPhase(phaseId)
            await markProductPhaseAsReady(phaseId)
            
            // Recargar fases para actualizar estado
            const updatedPhases = await getProductPhasesByProductId(product.id)
            setPhases(updatedPhases)
            
            toast.success("Fase marcada como lista")
        } catch (err) {
            console.error('Error al marcar fase como lista:', err)
            toast.error(err instanceof Error ? err.message : 'Error al marcar fase como lista')
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
            toast.success("Ingrediente eliminado correctamente")
            refreshData()
        } catch (err) {
            console.error('Error al eliminar receta:', err)
            toast.error(err instanceof Error ? err.message : 'Error al eliminar ingrediente')
        }
    }

    // Función para marcar producto como listo/no listo
    const handleToggleProductReady = async () => {
        try {
            await markProductAsReady(product.id)
            
            // Recargar producto (en una implementación real, esto vendría del servidor)
            toast.success(`Producto marcado como ${product.isReady ? 'No Listo' : 'Listo'}`)
        } catch (err) {
            console.error('Error al cambiar estado del producto:', err)
            toast.error(err instanceof Error ? err.message : 'Error al cambiar estado del producto')
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
                onMarkPhaseReady={handleMarkPhaseReady}
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

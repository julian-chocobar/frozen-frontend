"use client"

import { useState } from "react"
import { RecipeResponse, RecipeUpdateRequest, Phase } from "@/types"
import { updateRecipe } from "@/lib/recipes-api"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface RecipeEditFormProps {
    recipe: RecipeResponse
    phase: Phase
    onSave: () => void
    onCancel: () => void
}

export function RecipeEditForm({ recipe, phase, onSave, onCancel }: RecipeEditFormProps) {
    const [formData, setFormData] = useState({
        materialId: recipe.materialName, // Usar el nombre del material para mostrar
        quantity: recipe.quantity,
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (formData.quantity <= 0) {
            newErrors.quantity = "La cantidad debe ser mayor a 0"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setLoading(true)
            
            const updateData: RecipeUpdateRequest = {
                quantity: formData.quantity
            }

            await updateRecipe(recipe.id, updateData)
            toast.success("Ingrediente actualizado correctamente")
            onSave()
        } catch (err) {
            console.error('Error al actualizar receta:', err)
            toast.error(err instanceof Error ? err.message : 'Error al actualizar ingrediente')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
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
        <div 
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.08)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
        >
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-600">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-primary-900 mb-2">
                            Editar Ingrediente en: {getPhaseLabel(phase)}
                        </h2>
                        <p className="text-sm text-primary-600">
                            Modifica la cantidad de este ingrediente
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Material
                                </label>
                                <div className="w-full px-3 py-2 border border-stroke rounded-lg bg-primary-50 text-primary-700">
                                    {recipe.materialName} ({recipe.materialCode})
                                </div>
                                <p className="text-xs text-primary-500 mt-1">
                                    Este campo no se puede modificar
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Cantidad *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.quantity}
                                    onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || 0)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                                        errors.quantity ? "border-red-500" : "border-stroke"
                                    }`}
                                    placeholder="Ej: 2.5"
                                />
                                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-stroke">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onCancel}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Actualizando..." : "Actualizar Ingrediente"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

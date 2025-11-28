"use client"

import { useState, useEffect } from "react"
import { ProductPhaseResponse, RecipeCreateRequest, Phase } from "@/types"
import { createRecipe } from "@/lib/recipes"
import { getMaterialsIdNameList, MaterialIdName } from "@/lib/materials/api"
import { Button } from "@/components/ui/button"
import { MaterialSearchFilter } from "@/app/(dashboard)/movimientos/_components/material-search-filter"
import { toast } from "sonner"

interface RecipeFormProps {
    phase: ProductPhaseResponse
    onSave: () => void
    onCancel: () => void
}

export function RecipeForm({ phase, onSave, onCancel }: RecipeFormProps) {
    const [formData, setFormData] = useState({
        materialId: "",
        quantity: "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (!formData.materialId) {
            newErrors.materialId = "Debe seleccionar un material"
        }
        if (formData.quantity && Number(formData.quantity) <= 0) {
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
            
            const recipeData: RecipeCreateRequest = {
                productPhaseId: phase.id,
                materialId: formData.materialId,
                quantity: Number(formData.quantity)
            }

            await createRecipe(recipeData)
            toast.success("Ingrediente agregado correctamente")
            onSave()
        } catch (err) {
            console.error('Error al crear receta:', err)
            toast.error(err instanceof Error ? err.message : 'Error al agregar ingrediente')
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        // Convert empty string to undefined to avoid 0 being set when clearing the field
        const newValue = value === '' ? undefined : value;
        setFormData(prev => ({ ...prev, [field]: newValue }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }));
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
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
        >
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border-2 border-primary-600">
                <div className="p-8">
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-primary-900 mb-2">
                            Agregar Ingrediente a: {getPhaseLabel(phase.phase)}
                        </h2>
                        <p className="text-sm text-primary-600">
                            Selecciona un material y especifica la cantidad necesaria para esta fase
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Material *
                                </label>
                                <MaterialSearchFilter
                                    value={formData.materialId}
                                    onChange={(materialId) => handleChange("materialId", materialId)}
                                    placeholder="Buscar material por nombre..."
                                    className={errors.materialId ? "border-red-500" : ""}
                                    phase={phase.phase as Phase}
                                />
                                {errors.materialId && <p className="text-red-500 text-sm mt-1">{errors.materialId}</p>}
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
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty string or valid number
                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            handleChange("quantity", value === '' ? '' : parseFloat(value));
                                        }
                                    }}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 text-base ${
                                        errors.quantity ? "border-red-500" : "border-stroke"
                                    }`}
                                    placeholder="Ej: 2.5"
                                />
                                {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-8 border-t border-stroke mt-8">
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
                                {loading ? "Agregando..." : "Agregar Ingrediente"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

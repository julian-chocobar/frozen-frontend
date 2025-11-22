"use client"

import { useState } from "react"
import { ProductPhaseResponse, ProductPhaseUpdateRequest, UnitMeasurement } from "@/types"
import { updateProductPhase } from "@/lib/phases/product-phases-api"
import { Button } from "@/components/ui/button"
import { getUnitMeasurements } from "@/lib/materials/api"
import { toast } from "sonner"

interface PhaseFormProps {
    phase: ProductPhaseResponse
    onSave: () => void
    onCancel: () => void
}

export function PhaseForm({ phase, onSave, onCancel }: PhaseFormProps) {
    const [formData, setFormData] = useState({
        input: phase.input || "",
        output: phase.output || "",
        outputUnit: phase.outputUnit || "KG" as UnitMeasurement,
        estimatedHours: phase.estimatedHours || "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const unitMeasurements = getUnitMeasurements()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (formData.input && Number(formData.input) <= 0) {
            newErrors.input = "La entrada debe ser mayor a 0"
        }
        if (formData.output && Number(formData.output) <= 0) {
            newErrors.output = "La salida debe ser mayor a 0"
        }
        if (!formData.outputUnit) {
            newErrors.outputUnit = "La unidad de salida es requerida"
        }
        if (formData.estimatedHours && Number(formData.estimatedHours) <= 0) {
            newErrors.estimatedHours = "Las horas estimadas deben ser mayor a 0"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) return

        try {
            setLoading(true)
            
            const updateData: ProductPhaseUpdateRequest = {}
            if (formData.input !== phase.input) updateData.input = Number(formData.input)
            if (formData.output !== phase.output) updateData.output = Number(formData.output)
            if (formData.outputUnit !== phase.outputUnit) updateData.outputUnit = formData.outputUnit
            if (formData.estimatedHours !== phase.estimatedHours) updateData.estimatedHours = Number(formData.estimatedHours)

            await updateProductPhase(phase.id, updateData)
            toast.success("Fase actualizada correctamente")
            onSave()
        } catch (err) {
            console.error('Error al actualizar fase:', err)
            toast.error(err instanceof Error ? err.message : 'Error al actualizar fase')
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
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
            }}
        >
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-600">
                <div className="p-6">
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-primary-900 mb-2">
                            Editar Fase: {getPhaseLabel(phase.phase)}
                        </h2>
                        <p className="text-sm text-primary-600">
                            Modifica los parámetros de esta fase del producto
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Entrada *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.input}
                                    onChange={(e) => handleChange("input", parseFloat(e.target.value) || 0)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                                        errors.input ? "border-red-500" : "border-stroke"
                                    }`}
                                    placeholder="Ej: 100"
                                />
                                {errors.input && <p className="text-red-500 text-sm mt-1">{errors.input}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Salida *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.output}
                                    onChange={(e) => handleChange("output", parseFloat(e.target.value) || 0)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                                        errors.output ? "border-red-500" : "border-stroke"
                                    }`}
                                    placeholder="Ej: 95"
                                />
                                {errors.output && <p className="text-red-500 text-sm mt-1">{errors.output}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Unidad de Salida *
                                </label>
                                <select
                                    value={formData.outputUnit}
                                    onChange={(e) => handleChange("outputUnit", e.target.value as UnitMeasurement)}
                                    className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
                                >
                                    {unitMeasurements.map((unit) => (
                                        <option key={unit.value} value={unit.value}>
                                            {unit.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Horas Estimadas *
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={formData.estimatedHours}
                                    onChange={(e) => handleChange("estimatedHours", parseFloat(e.target.value) || 0)}
                                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                                        errors.estimatedHours ? "border-red-500" : "border-stroke"
                                    }`}
                                    placeholder="Ej: 2.5"
                                />
                                {errors.estimatedHours && <p className="text-red-500 text-sm mt-1">{errors.estimatedHours}</p>}
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
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

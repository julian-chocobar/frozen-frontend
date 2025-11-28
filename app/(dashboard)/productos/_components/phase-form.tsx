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
        input: phase.phase === 'MOLIENDA' ? "0" : (phase.input || ""),
        output: phase.output || "",
        outputUnit: phase.outputUnit || "KG" as UnitMeasurement,
        estimatedHours: phase.estimatedHours || "",
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [apiError, setApiError] = useState<string | null>(null)

    const unitMeasurements = getUnitMeasurements()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        
        if (formData.input && Number(formData.input) <= 0 && phase.phase !== 'MOLIENDA') {
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
        setApiError(null) // Clear previous API errors

        if (!validateForm()) return

        try {
            setLoading(true)
            
            const updateData: ProductPhaseUpdateRequest = {}
            // Only include output, outputUnit, and estimatedHours in the update
            if (formData.output !== phase.output) updateData.output = Number(formData.output)
            if (formData.outputUnit !== phase.outputUnit) updateData.outputUnit = formData.outputUnit
            if (formData.estimatedHours !== phase.estimatedHours) updateData.estimatedHours = Number(formData.estimatedHours)

            await updateProductPhase(phase.id, updateData)
            toast.success("Fase actualizada correctamente")
            onSave()
        } catch (error: unknown) {
            console.error('Error al actualizar fase:', error)
            
            // Handle API validation errors
            if (error && typeof error === 'object' && 'isApiError' in error) {
                const apiError = error as {
                    isApiError: boolean
                    status: number
                    message: string
                    details?: Record<string, string>
                }
                
                // If there are validation errors in details, add them to the form errors
                if (apiError.details) {
                    const fieldErrors: Record<string, string> = {}
                    Object.entries(apiError.details).forEach(([field, message]) => {
                        const fieldName = field.toLowerCase()
                        fieldErrors[fieldName] = message
                    })
                    setErrors(fieldErrors)
                } else {
                    // If it's a general API error, show it at the top of the form
                    setApiError(apiError.message)
                }
                
                // Also show a toast with the error
                toast.error(apiError.message || 'Error al actualizar la fase')
            } else {
                // For non-API errors, show a generic error message
                const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
                setApiError(errorMessage)
                toast.error('Error al actualizar la fase')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        // Don't update input field if phase is MOLIENDA
        if (field === 'input' && phase.phase === 'MOLIENDA') {
            return;
        }
        
        // Convert value to string to handle empty strings properly
        const stringValue = value === '' ? '' : String(value);
        
        setFormData(prev => ({ ...prev, [field]: stringValue }));
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
                        {/* API Error Message */}
                        {apiError && (
                            <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
                                <p className="font-medium">Error del servidor</p>
                                <p>{apiError}</p>
                            </div>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-primary-900 mb-2">
                                    Entrada
                                </label>
                                <div className="w-full px-3 py-2 border border-stroke rounded-lg bg-gray-50 text-gray-700">
                                    {phase.phase === 'MOLIENDA' ? '0' : (phase.input || 'N/A')}
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    {phase.phase === 'MOLIENDA' 
                                        ? 'La entrada para molienda siempre es 0' 
                                        : 'La entrada se calcula automáticamente de la fase anterior'}
                                </p>
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
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty string or valid number
                                        if (value === '' || /^\d*\.?\d*$/.test(value)) {
                                            handleChange("output", value);
                                        }
                                    }}
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
                                    step="0.1"
                                    min="0"
                                    value={formData.estimatedHours}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Allow empty string or valid decimal with one decimal place
                                        if (value === '' || /^\d*\.?\d{0,1}$/.test(value)) {
                                            handleChange("estimatedHours", value);
                                        }
                                    }}
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

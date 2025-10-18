"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import type { PackagingCreateRequest, PackagingResponse, UnitMeasurement } from "@/types"
import { getUnitMeasurements } from "@/lib/materials-api"

interface PackagingFormProps {
    packaging?: PackagingResponse
    onSubmit: (data: PackagingCreateRequest) => void
    onCancel: () => void
    isLoading?: boolean
}

export function PackagingForm({ packaging, onSubmit, onCancel, isLoading = false }: PackagingFormProps) {
    const isEditing = !!packaging
    const [formData, setFormData] = useState({
        name: packaging?.name || "",
        unitMeasurement: packaging?.unitMeasurement || "UNIDAD" as UnitMeasurement,
        quantity: packaging?.quantity || 0,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const unitMeasurements = getUnitMeasurements()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido"
        }

        if (!formData.unitMeasurement) {
            newErrors.unitMeasurement = "La unidad de medida es requerida"
        }

        if (formData.quantity <= 0) {
            newErrors.quantity = "La cantidad debe ser mayor a 0"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (validateForm()) {
            const createData: PackagingCreateRequest = {
                name: formData.name,
                unitMeasurement: formData.unitMeasurement,
                quantity: formData.quantity,
            }
            onSubmit(createData)
        }
    }

    const handleChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombre */}
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Nombre *
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleChange("name", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                            errors.name ? "border-red-500" : "border-stroke"
                        }`}
                        placeholder="Ej: Botella de 330ml"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                {/* Unidad de Medida */}
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Unidad de Medida *
                    </label>
                    <select
                        value={formData.unitMeasurement}
                        onChange={(e) => handleChange("unitMeasurement", e.target.value as UnitMeasurement)}
                        className={`w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                            errors.unitMeasurement ? "border-red-500" : "border-stroke"
                        }`}
                    >
                        {unitMeasurements.map((unit) => (
                            <option key={unit.value} value={unit.value}>
                                {unit.label}
                            </option>
                        ))}
                    </select>
                    {errors.unitMeasurement && <p className="text-red-500 text-sm mt-1">{errors.unitMeasurement}</p>}
                </div>

                {/* Cantidad */}
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Cantidad *
                    </label>
                    <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleChange("quantity", parseInt(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                            errors.quantity ? "border-red-500" : "border-stroke"
                        }`}
                        placeholder="Ej: 100"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                </div>
            </div>
            {/* Botones */}
            <div className="flex justify-end gap-3 pt-6 border-t border-stroke">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-primary-600 bg-white border border-stroke rounded-lg hover:bg-primary-50 transition-colors"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? "Guardando..." : packaging? "Actualizar" : "Crear"}
                </button>
            </div>
        </form>
    )
}
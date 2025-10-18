"use client"

import { useState } from "react"
import { ProductCreateRequest, ProductUpdateRequest, ProductResponse, UnitMeasurement } from "@/types"
import { Button } from "@/components/ui/button"
import { getUnitMeasurements } from "@/lib/materials-api"

interface ProductFormProps {
    product?: ProductResponse
    onSubmit: (data: ProductCreateRequest | ProductUpdateRequest) => void
    onCancel: () => void
    isLoading?: boolean
}

export function ProductForm({ product, onSubmit, onCancel, isLoading = false }: ProductFormProps) {
    const isEditing = !!product

    const [formData, setFormData] = useState({
        name: product?.name || "",
        isAlcoholic: product?.isAlcoholic || true,
        standardQuantity: product?.standardQuantity || 0,
        unitMeasurement: product?.unitMeasurement || "LT" as UnitMeasurement,
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const unitMeasurements = getUnitMeasurements()
    
    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido"
        }
        if (formData.standardQuantity <= 0) {
            newErrors.standardQuantity = "La cantidad estándar debe ser mayor a 0"
        }
        if (!formData.unitMeasurement) {
            newErrors.unitMeasurement = "La unidad de medida es requerida"
        }
    
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (validateForm()) {
            if (isEditing) {
                const updateData: ProductUpdateRequest = {}
                if (formData.name !== product?.name) updateData.name = formData.name
                if (formData.isAlcoholic !== product?.isAlcoholic) updateData.isAlcoholic = formData.isAlcoholic
                if (formData.standardQuantity !== product?.standardQuantity) updateData.standardQuantity = formData.standardQuantity
                if (formData.unitMeasurement !== product?.unitMeasurement) updateData.unitMeasurement = formData.unitMeasurement
                onSubmit(updateData)
            } else {
                const createData: ProductCreateRequest = {
                    name: formData.name,
                    isAlcoholic: formData.isAlcoholic,
                    standardQuantity: formData.standardQuantity,
                    unitMeasurement: formData.unitMeasurement
                }
                onSubmit(createData)
            }
        }
    }

const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: "" }))
    }
}
    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-background p-4 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        placeholder="Ej: IPA Americana"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Alcoholico *
                    </label>
                    <input
                        type="checkbox"
                        checked={formData.isAlcoholic}
                        onChange={(e) => handleChange("isAlcoholic", e.target.checked)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                            errors.isAlcoholic ? "border-red-500" : "border-stroke"
                        }`}
                    />
                    {errors.isAlcoholic && <p className="text-red-500 text-sm mt-1">{errors.isAlcoholic}</p>}
                </div>
                
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Cantidad Estándar *
                    </label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.standardQuantity}
                        onChange={(e) => handleChange("standardQuantity", parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                            errors.standardQuantity ? "border-red-500" : "border-stroke"
                        }`}
                        placeholder="Ej: 485"
                    />
                    {errors.standardQuantity && <p className="text-red-500 text-sm mt-1">{errors.standardQuantity}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Unidad de Medida *
                    </label>
                    <select
                        value={formData.unitMeasurement}
                        onChange={(e) => handleChange("unitMeasurement", e.target.value as UnitMeasurement)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
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
                    {isLoading ? "Guardando..." : product? "Actualizar" : "Crear"}
                </button>
            </div>
        </form>
    )
}
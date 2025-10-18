"use client"

import { useState } from "react"
import { ProductCreateRequest, ProductUpdateRequest, ProductResponse } from "@/types"
import { Button } from "@/components/ui/button"

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
    })

    const [errors, setErrors] = useState<Record<string, string>>({})
    const validateForm = () => {
        const newErrors: Record<string, string> = {}
        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido"
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
                onSubmit(updateData)
            } else {
                const createData: ProductCreateRequest = {
                    name: formData.name,
                    isAlcoholic: formData.isAlcoholic
                }
                onSubmit(createData)
            }
        }
    }

const handleChange = (field: string, value: string | boolean) => {
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
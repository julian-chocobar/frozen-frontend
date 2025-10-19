"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import type { PackagingCreateRequest, PackagingResponse, UnitMeasurement } from "@/types"
import type { MaterialIdName } from "@/lib/materials-api"
import { getUnitMeasurements, getMaterialsIdNameList } from "@/lib/materials-api"

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
        materialId: "",
        unitMeasurement: packaging?.unitMeasurement || "UNIDAD" as UnitMeasurement,
        quantity: packaging?.quantity || 0,
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [materials, setMaterials] = useState<MaterialIdName[]>([])
    const [loadingMaterials, setLoadingMaterials] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [showDropdown, setShowDropdown] = useState(false)
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialIdName | null>(null)
    const unitMeasurements = getUnitMeasurements()

    // Buscar materiales de tipo ENVASADO cuando cambie el término de búsqueda
    useEffect(() => {
        const searchMaterials = async () => {
            if (!searchTerm.trim()) {
                setMaterials([])
                return
            }

            setLoadingMaterials(true)
            try {
                const materialsList = await getMaterialsIdNameList({
                    name: searchTerm,
                    active: true,
                    phase: "ENVASADO"
                })
                setMaterials(materialsList)
            } catch (error) {
                console.error('Error al buscar materiales:', error)
                setMaterials([])
            } finally {
                setLoadingMaterials(false)
            }
        }

        // Debounce la búsqueda
        const timeoutId = setTimeout(searchMaterials, 300)
        return () => clearTimeout(timeoutId)
    }, [searchTerm])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido"
        }
        if (!formData.materialId) {
            newErrors.materialId = "El material es requerido"
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
                materialId: formData.materialId,
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

    const handleMaterialSelect = (material: MaterialIdName) => {
        setFormData(prev => ({ ...prev, materialId: material.id.toString() }))
        setSearchTerm(material.name)
        setShowDropdown(false)
        setSelectedMaterial(material)
        // Limpiar error si existe
        if (errors.materialId) {
            setErrors(prev => ({ ...prev, materialId: "" }))
        }
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value)
        setShowDropdown(true)
        // Si el usuario está escribiendo, limpiar la selección
        if (value !== searchTerm && formData.materialId) {
            setFormData(prev => ({ ...prev, materialId: "" }))
            setSelectedMaterial(null)
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

                {/* Material */}
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Material de Envasado *
                    </label>
                    
                    {/* Campo de búsqueda */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Buscar material de envasado..."
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                                errors.materialId ? "border-red-500" : "border-stroke"
                            }`}
                        />
                        {loadingMaterials && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Dropdown de resultados */}
                    {showDropdown && searchTerm && (
                        <div className="absolute z-50 w-full mt-1 max-h-32 overflow-y-auto border border-stroke rounded-lg bg-white shadow-lg">
                            {materials.length === 0 && !loadingMaterials ? (
                                <div className="px-3 py-2 text-sm text-gray-500">
                                    No se encontraron materiales de envasado
                                </div>
                            ) : (
                                materials.map((material) => (
                                    <button
                                        key={material.id}
                                        type="button"
                                        onClick={() => handleMaterialSelect(material)}
                                        className="w-full px-3 py-2 text-left hover:bg-primary-50 border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-primary-900 text-sm">{material.name}</div>
                                        <div className="text-xs text-primary-600">Código: {material.code}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* Overlay para cerrar dropdown */}
                    {showDropdown && (
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowDropdown(false)}
                        />
                    )}

                    {errors.materialId && <p className="text-red-500 text-sm mt-1">{errors.materialId}</p>}
                    
                    {/* Información del material seleccionado */}
                    {selectedMaterial && (
                        <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 mb-1">Material Seleccionado</h4>
                            <div className="text-sm text-blue-700">
                                <div>
                                    <span className="font-medium">Nombre:</span> {selectedMaterial.name}
                                </div>
                                <div>
                                    <span className="font-medium">Código:</span> {selectedMaterial.code}
                                </div>
                                <div>
                                    <span className="font-medium">ID:</span> {selectedMaterial.id}
                                </div>
                            </div>
                        </div>
                    )}
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
                        step="0.01"
                        min="0"
                        value={formData.quantity}
                        onChange={(e) => handleChange("quantity", parseFloat(e.target.value) || 0)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                            errors.quantity ? "border-red-500" : "border-stroke"
                        }`}
                        placeholder="Ej: 100.50"
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
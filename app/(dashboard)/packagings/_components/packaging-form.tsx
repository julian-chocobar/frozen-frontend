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
        packagingMaterialId: "",
        labelingMaterialId: "",
        unitMeasurement: packaging?.unitMeasurement || "UNIDAD" as UnitMeasurement,
        quantity: packaging?.quantity || "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    
    // Estados para material de envasado
    const [packagingMaterials, setPackagingMaterials] = useState<MaterialIdName[]>([])
    const [loadingPackagingMaterials, setLoadingPackagingMaterials] = useState(false)
    const [packagingSearchTerm, setPackagingSearchTerm] = useState("")
    const [showPackagingDropdown, setShowPackagingDropdown] = useState(false)
    const [selectedPackagingMaterial, setSelectedPackagingMaterial] = useState<MaterialIdName | null>(null)
    
    // Estados para material de etiquetado
    const [labelingMaterials, setLabelingMaterials] = useState<MaterialIdName[]>([])
    const [loadingLabelingMaterials, setLoadingLabelingMaterials] = useState(false)
    const [labelingSearchTerm, setLabelingSearchTerm] = useState("")
    const [showLabelingDropdown, setShowLabelingDropdown] = useState(false)
    const [selectedLabelingMaterial, setSelectedLabelingMaterial] = useState<MaterialIdName | null>(null)
    
    const unitMeasurements = getUnitMeasurements()

    // Buscar materiales de tipo ENVASE para packaging
    useEffect(() => {
        const searchPackagingMaterials = async () => {
            if (!packagingSearchTerm.trim()) {
                setPackagingMaterials([])
                return
            }

            setLoadingPackagingMaterials(true)
            try {
                const materialsList = await getMaterialsIdNameList({
                    name: packagingSearchTerm,
                    active: true,
                    type: "ENVASE"
                })
                setPackagingMaterials(materialsList)
            } catch (error) {
                console.error('Error al buscar materiales de envase:', error)
                setPackagingMaterials([])
            } finally {
                setLoadingPackagingMaterials(false)
            }
        }

        // Debounce la búsqueda
        const timeoutId = setTimeout(searchPackagingMaterials, 300)
        return () => clearTimeout(timeoutId)
    }, [packagingSearchTerm])

    // Buscar materiales de tipo ETIQUETADO para labeling
    useEffect(() => {
        const searchLabelingMaterials = async () => {
            if (!labelingSearchTerm.trim()) {
                setLabelingMaterials([])
                return
            }

            setLoadingLabelingMaterials(true)
            try {
                const materialsList = await getMaterialsIdNameList({
                    name: labelingSearchTerm,
                    active: true,
                    type: "ETIQUETADO"
                })
                setLabelingMaterials(materialsList)
            } catch (error) {
                console.error('Error al buscar materiales de etiquetado:', error)
                setLabelingMaterials([])
            } finally {
                setLoadingLabelingMaterials(false)
            }
        }

        // Debounce la búsqueda
        const timeoutId = setTimeout(searchLabelingMaterials, 300)
        return () => clearTimeout(timeoutId)
    }, [labelingSearchTerm])

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = "El nombre es requerido"
        }
        if (!formData.packagingMaterialId) {
            newErrors.packagingMaterialId = "El material de envasado es requerido"
        }
        if (!formData.labelingMaterialId) {
            newErrors.labelingMaterialId = "El material de etiquetado es requerido"
        }

        if (!formData.unitMeasurement) {
            newErrors.unitMeasurement = "La unidad de medida es requerida"
        }

        if (!formData.quantity || formData.quantity === "" || Number(formData.quantity) <= 0) {
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
                packagingMaterialId: formData.packagingMaterialId,
                labelingMaterialId: formData.labelingMaterialId,
                unitMeasurement: formData.unitMeasurement,
                quantity: Number(formData.quantity),
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

    // Handlers para material de envasado
    const handlePackagingMaterialSelect = (material: MaterialIdName) => {
        setFormData(prev => ({ ...prev, packagingMaterialId: material.id.toString() }))
        setPackagingSearchTerm(material.name)
        setShowPackagingDropdown(false)
        setSelectedPackagingMaterial(material)
        // Limpiar error si existe
        if (errors.packagingMaterialId) {
            setErrors(prev => ({ ...prev, packagingMaterialId: "" }))
        }
    }

    const handlePackagingSearchChange = (value: string) => {
        setPackagingSearchTerm(value)
        setShowPackagingDropdown(true)
        // Si el usuario está escribiendo, limpiar la selección
        if (value !== packagingSearchTerm && formData.packagingMaterialId) {
            setFormData(prev => ({ ...prev, packagingMaterialId: "" }))
            setSelectedPackagingMaterial(null)
        }
    }

    // Handlers para material de etiquetado
    const handleLabelingMaterialSelect = (material: MaterialIdName) => {
        setFormData(prev => ({ ...prev, labelingMaterialId: material.id.toString() }))
        setLabelingSearchTerm(material.name)
        setShowLabelingDropdown(false)
        setSelectedLabelingMaterial(material)
        // Limpiar error si existe
        if (errors.labelingMaterialId) {
            setErrors(prev => ({ ...prev, labelingMaterialId: "" }))
        }
    }

    const handleLabelingSearchChange = (value: string) => {
        setLabelingSearchTerm(value)
        setShowLabelingDropdown(true)
        // Si el usuario está escribiendo, limpiar la selección
        if (value !== labelingSearchTerm && formData.labelingMaterialId) {
            setFormData(prev => ({ ...prev, labelingMaterialId: "" }))
            setSelectedLabelingMaterial(null)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
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

                {/* Material de Envasado */}
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Material de Envasado *
                    </label>
                    
                    {/* Campo de búsqueda */}
                    <div className="relative">
                        <input
                            type="text"
                            value={packagingSearchTerm}
                            onChange={(e) => handlePackagingSearchChange(e.target.value)}
                            onFocus={() => setShowPackagingDropdown(true)}
                            placeholder="Buscar material de envasado..."
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                                errors.packagingMaterialId ? "border-red-500" : "border-stroke"
                            }`}
                        />
                        {loadingPackagingMaterials && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Dropdown de resultados */}
                    {showPackagingDropdown && packagingSearchTerm && (
                        <div className="absolute z-50 w-full mt-1 max-h-32 overflow-y-auto border border-stroke rounded-lg bg-white shadow-lg">
                            {packagingMaterials.length === 0 && !loadingPackagingMaterials ? (
                                <div className="px-3 py-2 text-sm text-primary-600">
                                    No se encontraron materiales de envasado
                                </div>
                            ) : (
                                packagingMaterials.map((material) => (
                                    <button
                                        key={material.id}
                                        type="button"
                                        onClick={() => handlePackagingMaterialSelect(material)}
                                        className="w-full px-3 py-2 text-left hover:bg-primary-50 border-b border-primary-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-primary-900 text-sm">{material.name}</div>
                                        <div className="text-xs text-primary-600">Código: {material.code}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* Overlay para cerrar dropdown */}
                    {showPackagingDropdown && (
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowPackagingDropdown(false)}
                        />
                    )}

                    {errors.packagingMaterialId && <p className="text-red-500 text-sm mt-1">{errors.packagingMaterialId}</p>}
                    
                    {/* Información del material seleccionado */}
                    {selectedPackagingMaterial && (
                        <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                            <h4 className="text-sm font-medium text-primary-800 mb-1">Material de Envasado Seleccionado</h4>
                            <div className="text-sm text-primary-700">
                                <div>
                                    <span className="font-medium">Nombre:</span> {selectedPackagingMaterial.name}
                                </div>
                                <div>
                                    <span className="font-medium">Código:</span> {selectedPackagingMaterial.code}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Material de Etiquetado */}
                <div>
                    <label className="block text-sm font-medium text-primary-900 mb-2">
                        Material de Etiquetado *
                    </label>
                    
                    {/* Campo de búsqueda */}
                    <div className="relative">
                        <input
                            type="text"
                            value={labelingSearchTerm}
                            onChange={(e) => handleLabelingSearchChange(e.target.value)}
                            onFocus={() => setShowLabelingDropdown(true)}
                            placeholder="Buscar material de etiquetado..."
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                                errors.labelingMaterialId ? "border-red-500" : "border-stroke"
                            }`}
                        />
                        {loadingLabelingMaterials && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                <div className="w-4 h-4 border-2 border-primary-300 border-t-primary-600 rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Dropdown de resultados */}
                    {showLabelingDropdown && labelingSearchTerm && (
                        <div className="absolute z-50 w-full mt-1 max-h-32 overflow-y-auto border border-stroke rounded-lg bg-white shadow-lg">
                            {labelingMaterials.length === 0 && !loadingLabelingMaterials ? (
                                <div className="px-3 py-2 text-sm text-primary-600">
                                    No se encontraron materiales de etiquetado
                                </div>
                            ) : (
                                labelingMaterials.map((material) => (
                                    <button
                                        key={material.id}
                                        type="button"
                                        onClick={() => handleLabelingMaterialSelect(material)}
                                        className="w-full px-3 py-2 text-left hover:bg-primary-50 border-b border-primary-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-primary-900 text-sm">{material.name}</div>
                                        <div className="text-xs text-primary-600">Código: {material.code}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* Overlay para cerrar dropdown */}
                    {showLabelingDropdown && (
                        <div 
                            className="fixed inset-0 z-40" 
                            onClick={() => setShowLabelingDropdown(false)}
                        />
                    )}

                    {errors.labelingMaterialId && <p className="text-red-500 text-sm mt-1">{errors.labelingMaterialId}</p>}
                    
                    {/* Información del material seleccionado */}
                    {selectedLabelingMaterial && (
                        <div className="mt-2 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                            <h4 className="text-sm font-medium text-primary-800 mb-1">Material de Etiquetado Seleccionado</h4>
                            <div className="text-sm text-primary-700">
                                <div>
                                    <span className="font-medium">Nombre:</span> {selectedLabelingMaterial.name}
                                </div>
                                <div>
                                    <span className="font-medium">Código:</span> {selectedLabelingMaterial.code}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        onChange={(e) => handleChange("quantity", e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                            errors.quantity ? "border-red-500" : "border-stroke"
                        }`}
                        placeholder="Ej: 100.50"
                    />
                    {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
                </div>
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
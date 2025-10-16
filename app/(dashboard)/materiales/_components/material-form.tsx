"use client"

/**
 * Formulario para crear y editar materiales
 */

import { useState, useEffect } from "react"
import { getMaterialTypes, getUnitMeasurements } from "@/lib/materials-api"
import type { Material, MaterialType, UnitMeasurement, MaterialCreateRequest, MaterialUpdateRequest } from "@/types"

interface MaterialFormProps {
  material?: Material
  onSubmit: (data: MaterialCreateRequest | MaterialUpdateRequest) => void
  onCancel: () => void
  isLoading?: boolean
  /** Si true, permite editar el stock (solo para casos especiales) */
  allowStockEdit?: boolean
}

export function MaterialForm({ material, onSubmit, onCancel, isLoading = false, allowStockEdit = false }: MaterialFormProps) {
  const isEditing = !!material
  
  const [formData, setFormData] = useState({
    name: material?.name || "",
    type: material?.type || "MALTA" as MaterialType,
    supplier: material?.supplier || "",
    value: material?.value || 0,
    stock: material?.stock || 0,
    unitMeasurement: material?.unitMeasurement || "KG" as UnitMeasurement,
    threshold: material?.threshold || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const materialTypes = getMaterialTypes()
  const unitMeasurements = getUnitMeasurements()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Campos obligatorios para creación
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (formData.threshold <= 0) {
      newErrors.threshold = "El umbral debe ser mayor a 0"
    }

    // Validaciones para campos opcionales (solo si tienen valor)
    if (formData.value && formData.value <= 0) {
      newErrors.value = "El valor debe ser mayor a 0"
    }

    if (formData.stock && formData.stock <= 0) {
      newErrors.stock = "El stock debe ser mayor a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      if (isEditing) {
        // Para edición, enviar solo campos que han cambiado y tienen valor
        const updateData: MaterialUpdateRequest = {}
        
        if (formData.name !== material?.name) updateData.name = formData.name
        if (formData.type !== material?.type) updateData.type = formData.type
        if (formData.supplier !== material?.supplier) updateData.supplier = formData.supplier
        if (formData.value !== material?.value && formData.value > 0) updateData.value = formData.value
        if (formData.unitMeasurement !== material?.unitMeasurement) updateData.unitMeasurement = formData.unitMeasurement
        if (formData.threshold !== material?.threshold && formData.threshold > 0) updateData.threshold = formData.threshold
        
        // Solo incluir stock si allowStockEdit es true (para casos especiales)
        if (allowStockEdit && formData.stock !== material?.stock && formData.stock > 0) {
          // Nota: Esto requeriría extender MaterialUpdateRequest o crear un tipo especial
          console.warn('Edición de stock no está soportada en MaterialUpdateRequest')
        }
        
        onSubmit(updateData)
      } else {
        // Para creación, enviar campos obligatorios y opcionales con valor
        const createData: MaterialCreateRequest = {
          name: formData.name,
          type: formData.type,
          unitMeasurement: formData.unitMeasurement,
          threshold: formData.threshold,
        }
        
        // Agregar campos opcionales solo si tienen valor
        if (formData.supplier.trim()) createData.supplier = formData.supplier
        if (formData.value > 0) createData.value = formData.value
        if (formData.stock > 0) createData.stock = formData.stock
        
        onSubmit(createData)
      }
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
            placeholder="Ej: Malta Pilsen"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Tipo *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value as MaterialType)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {materialTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Proveedor */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Proveedor
          </label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => handleChange("supplier", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="Ej: Proveedor ABC (opcional)"
          />
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Valor Unitario
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.value}
            onChange={(e) => handleChange("value", parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.value ? "border-red-500" : "border-stroke"
            }`}
            placeholder="0.00 (opcional)"
          />
          {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Stock Actual
            {isEditing && !allowStockEdit && (
              <span className="text-xs text-gray-500 ml-2">(Solo lectura - usar movimientos para cambios)</span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.stock}
            onChange={(e) => handleChange("stock", parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.stock ? "border-red-500" : "border-stroke"
            } ${isEditing && !allowStockEdit ? "bg-gray-100 cursor-not-allowed" : ""}`}
            placeholder="0.00 (opcional)"
            disabled={isEditing && !allowStockEdit}
            readOnly={isEditing && !allowStockEdit}
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          {isEditing && !allowStockEdit && (
            <p className="text-xs text-gray-500 mt-1">
              Para modificar el stock, usa la sección de movimientos de stock
            </p>
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
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            {unitMeasurements.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
        </div>

        {/* Umbral */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Umbral Mínimo *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.threshold}
            onChange={(e) => handleChange("threshold", parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.threshold ? "border-red-500" : "border-stroke"
            }`}
            placeholder="0.00"
          />
          {errors.threshold && <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>}
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
          {isLoading ? "Guardando..." : material ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  )
}

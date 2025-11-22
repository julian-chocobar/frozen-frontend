"use client"

/**
 * Formulario para crear y editar materiales con sistema de almacén simplificado
 */

import { useState, useMemo } from "react"
import { 
  getMaterialTypes, 
  getUnitMeasurements, 
  getWarehouseZones, 
  getSectionsForZone, 
  getWarehouseLevels 
} from "@/lib/materials/api"
import type {
  Material,
  MaterialDetailResponse,
  MaterialType,
  UnitMeasurement,
  MaterialCreateRequest,
  MaterialUpdateRequest,
  WarehouseZone,
  WarehouseLevel
} from "@/types"

interface MaterialFormProps {
  material?: Material | MaterialDetailResponse
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
    value: material?.value ?? "",
    stock: material?.availableStock ?? "",
    unitMeasurement: material?.unitMeasurement || "KG" as UnitMeasurement,
    threshold: material?.threshold ?? "",
    warehouseZone: material?.warehouseZone || "",
    warehouseSection: material?.warehouseSection || "",
    warehouseLevel: material?.warehouseLevel != null ? String(material.warehouseLevel) : "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const materialTypes = getMaterialTypes()
  const unitMeasurements = getUnitMeasurements()
  const warehouseZones = getWarehouseZones()
  const warehouseLevels = getWarehouseLevels()

  // Obtener las secciones disponibles para la zona seleccionada
  const availableSections = useMemo(() => {
    if (!formData.warehouseZone) return []
    return getSectionsForZone(formData.warehouseZone as MaterialType)
  }, [formData.warehouseZone])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Campos obligatorios
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.threshold || formData.threshold === "" || Number(formData.threshold) <= 0) {
      newErrors.threshold = "El umbral debe ser mayor a 0"
    }

    // Validaciones para campos opcionales (solo si tienen valor)
    if (formData.value && Number(formData.value) <= 0) {
      newErrors.value = "El valor debe ser mayor a 0"
    }

    if (allowStockEdit && formData.stock && Number(formData.stock) < 0) {
      newErrors.stock = "El stock no puede ser negativo"
    }

    // Validaciones de ubicación del almacén (solo si se proporciona información completa)
    if (formData.warehouseZone || formData.warehouseSection || formData.warehouseLevel) {
      if (!formData.warehouseZone) {
        newErrors.warehouseZone = "La zona es requerida si se especifica ubicación"
      }
      if (!formData.warehouseSection) {
        newErrors.warehouseSection = "La sección es requerida si se especifica ubicación"
      }
      if (!formData.warehouseLevel) {
        newErrors.warehouseLevel = "El nivel es requerido si se especifica ubicación"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      if (isEditing) {
        // Para edición, enviar todos los campos necesarios
        const updateData: MaterialUpdateRequest = {
          // Campos obligatorios que siempre deben enviarse
          name: formData.name,
          type: formData.type,
          unitMeasurement: formData.unitMeasurement,
          threshold: Number(formData.threshold)
        }
        
        // Campos opcionales
        if (formData.supplier) {
          updateData.supplier = formData.supplier
        }
        
        if (formData.value) {
          updateData.value = Number(formData.value)
        }

        // Campos de ubicación del almacén
        if (formData.warehouseZone !== (material?.warehouseZone || "")) {
          updateData.warehouseZone = formData.warehouseZone as WarehouseZone || undefined
        }
        if (formData.warehouseSection !== (material?.warehouseSection || "")) {
          updateData.warehouseSection = formData.warehouseSection ? String(formData.warehouseSection) : undefined
        }
        if (formData.warehouseLevel) {
          const levelNumber = Number(formData.warehouseLevel)
          if (levelNumber !== material?.warehouseLevel) {
            updateData.warehouseLevel = levelNumber as WarehouseLevel
          }
        }

        onSubmit(updateData)
      } else {
        // Para creación, enviar todos los campos
        const createData: MaterialCreateRequest = {
          name: formData.name,
          type: formData.type,
          unitMeasurement: formData.unitMeasurement,
          threshold: Number(formData.threshold),
        }

        if (formData.supplier) createData.supplier = formData.supplier
        if (formData.value) createData.value = Number(formData.value)
        if (allowStockEdit && formData.stock) createData.stock = Number(formData.stock)

        // Campos de ubicación del almacén
        if (formData.warehouseZone) createData.warehouseZone = formData.warehouseZone as WarehouseZone
        if (formData.warehouseSection) createData.warehouseSection = String(formData.warehouseSection)
        if (formData.warehouseLevel) {
          createData.warehouseLevel = Number(formData.warehouseLevel) as WarehouseLevel
        }

        onSubmit(createData)
      }
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Limpiar sección y nivel si cambia la zona
    if (field === 'warehouseZone') {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        warehouseSection: "",
        warehouseLevel: ""
      }))
    }
    
    // Limpiar errores del campo que se está editando
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Nombre del Material *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: Malta Pilsen"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Tipo de Material *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            {materialTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
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
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: Maltería Santa Fe"
          />
          {errors.supplier && <p className="text-red-500 text-sm mt-1">{errors.supplier}</p>}
        </div>

        {/* Unidad de Medida */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Unidad de Medida *
          </label>
          <select
            value={formData.unitMeasurement}
            onChange={(e) => handleChange("unitMeasurement", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            {unitMeasurements.map((unit) => (
              <option key={unit.value} value={unit.value}>
                {unit.label}
              </option>
            ))}
          </select>
          {errors.unitMeasurement && <p className="text-red-500 text-sm mt-1">{errors.unitMeasurement}</p>}
        </div>

        {/* Valor */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Valor por Unidad ($)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
          />
          {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
        </div>

        {/* Umbral */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Umbral Mínimo *
          </label>
          <input
            type="number"
            min="1"
            step="0.01"
            value={formData.threshold}
            onChange={(e) => handleChange("threshold", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="100"
          />
          {errors.threshold && <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>}
        </div>

        {/* Stock inicial (solo en creación si se permite) */}
        {allowStockEdit && (
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Stock Inicial
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={formData.stock}
              onChange={(e) => handleChange("stock", e.target.value)}
              className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
        )}
      </div>

      {/* Ubicación en el Almacén */}
      <div className="border-t border-stroke pt-6">
        <h3 className="text-lg font-medium text-primary-900 mb-4">Ubicación en el Almacén</h3>
        <p className="text-sm text-primary-600 mb-4">
          Especifica la ubicación del material en el almacén (opcional)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Zona */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Zona
            </label>
            <select
              value={formData.warehouseZone}
              onChange={(e) => handleChange("warehouseZone", e.target.value)}
              className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Seleccionar zona</option>
              {warehouseZones.map((zone) => (
                <option key={zone.value} value={zone.value}>
                  {zone.label}
                </option>
              ))}
            </select>
            {errors.warehouseZone && <p className="text-red-500 text-sm mt-1">{errors.warehouseZone}</p>}
          </div>

          {/* Sección */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Sección
            </label>
            <select
              value={formData.warehouseSection}
              onChange={(e) => handleChange("warehouseSection", e.target.value)}
              disabled={!formData.warehouseZone}
              className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-primary-50 disabled:text-primary-500"
            >
              <option value="">Seleccionar sección</option>
              {availableSections.map((section) => (
                <option key={section} value={section}>
                  {section}
                </option>
              ))}
            </select>
            {errors.warehouseSection && <p className="text-red-500 text-sm mt-1">{errors.warehouseSection}</p>}
          </div>

          {/* Nivel */}
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Nivel
            </label>
            <select
              value={formData.warehouseLevel}
              onChange={(e) => handleChange("warehouseLevel", e.target.value)}
              disabled={!formData.warehouseZone}
              className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500 disabled:bg-primary-50 disabled:text-primary-500"
            >
              <option value="">Seleccionar nivel</option>
              {warehouseLevels.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
            {errors.warehouseLevel && <p className="text-red-500 text-sm mt-1">{errors.warehouseLevel}</p>}
          </div>
        </div>

        {/* Resumen de ubicación */}
        {formData.warehouseZone && formData.warehouseSection && formData.warehouseLevel && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <p className="text-sm text-primary-700">
              <span className="font-medium">Ubicación:</span> {formData.warehouseZone}-{formData.warehouseSection} (Nivel {formData.warehouseLevel})
            </p>
          </div>
        )}
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
          {isLoading ? "Guardando..." : isEditing ? "Actualizar Material" : "Crear Material"}
        </button>
      </div>
    </form>
  )
}
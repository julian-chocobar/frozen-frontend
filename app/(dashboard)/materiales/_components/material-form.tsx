"use client"

/**
 * Formulario para crear y editar materiales
 */

import { useEffect, useMemo, useState } from "react"
import { getMaterialTypes, getUnitMeasurements } from "@/lib/materials-api"
import { getWarehouseInfo } from "@/lib/warehouse-api"
import type {
  Material,
  MaterialDetailResponse,
  MaterialType,
  UnitMeasurement,
  MaterialCreateRequest,
  MaterialUpdateRequest,
  WarehouseInfoResponse,
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
    warehouseSection: material?.warehouseSection ? String(material.warehouseSection) : "",
    warehouseLevel: material?.warehouseLevel != null ? String(material.warehouseLevel) : "",
    warehouseX: material?.warehouseX !== undefined && material?.warehouseX !== null ? String(material.warehouseX) : "",
    warehouseY: material?.warehouseY !== undefined && material?.warehouseY !== null ? String(material.warehouseY) : "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [warehouseInfo, setWarehouseInfo] = useState<WarehouseInfoResponse | null>(null)
  const [loadingWarehouseInfo, setLoadingWarehouseInfo] = useState(false)
  const [warehouseError, setWarehouseError] = useState<string | null>(null)

  const materialTypes = getMaterialTypes()
  const unitMeasurements = getUnitMeasurements()

  useEffect(() => {
    const fetchWarehouseInfo = async () => {
      try {
        setLoadingWarehouseInfo(true)
        setWarehouseError(null)
        const info = await getWarehouseInfo()
        setWarehouseInfo(info)
      } catch (error) {
        console.error('Error al cargar información del almacén:', error)
        setWarehouseError('No se pudo cargar la configuración del almacén')
      } finally {
        setLoadingWarehouseInfo(false)
      }
    }

    fetchWarehouseInfo()
  }, [])

  const zoneOptions = useMemo(() => {
    if (!warehouseInfo) return [] as string[]

    if (Array.isArray(warehouseInfo.availableZones)) {
      const raw = warehouseInfo.availableZones
      if (raw.length > 0 && typeof raw[0] === 'string') {
        return raw as string[]
      }
      // Si el backend devuelve objetos, extraer name
      return (raw as Array<{ name: string }>).map((zone) => zone.name)
    }

    return []
  }, [warehouseInfo])

  const sectionsForZone = useMemo(() => {
    if (!formData.warehouseZone || !warehouseInfo?.sectionsByZone) return []
    const entries = warehouseInfo.sectionsByZone
    if (Array.isArray(entries)) {
      // Compatibilidad: algunas versiones devuelven [{ zone, sections }]
      const found = entries.find((item: any) => item.zone === formData.warehouseZone)
      return found?.sections || []
    }
    return warehouseInfo.sectionsByZone[formData.warehouseZone] || []
  }, [formData.warehouseZone, warehouseInfo])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Campos obligatorios para creación
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.threshold || formData.threshold === "" || Number(formData.threshold) <= 0) {
      newErrors.threshold = "El umbral debe ser mayor a 0"
    }

    // Validaciones para campos opcionales (solo si tienen valor)
    if (formData.value && formData.value !== "" && Number(formData.value) < 0) {
      newErrors.value = "El valor no puede ser menor a 0"
    }

    if (formData.stock && formData.stock !== "" && Number(formData.stock) < 0) {
      newErrors.stock = "El stock no puede ser menor a 0"
    }

    if (formData.warehouseZone && !formData.warehouseSection) {
      newErrors.warehouseSection = "Selecciona una sección"
    }

    if (formData.warehouseX && Number(formData.warehouseX) < 0) {
      newErrors.warehouseX = "La coordenada X debe ser positiva"
    }

    if (formData.warehouseY && Number(formData.warehouseY) < 0) {
      newErrors.warehouseY = "La coordenada Y debe ser positiva"
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
        if (formData.value !== material?.value && formData.value !== "" && Number(formData.value) >= 0) updateData.value = Number(formData.value)
        if (formData.unitMeasurement !== material?.unitMeasurement) updateData.unitMeasurement = formData.unitMeasurement
        if (formData.threshold !== material?.threshold && formData.threshold !== "" && Number(formData.threshold) > 0) updateData.threshold = Number(formData.threshold)
        if (formData.warehouseZone !== (material?.warehouseZone || "")) updateData.warehouseZone = formData.warehouseZone || undefined
        if (formData.warehouseSection !== (material?.warehouseSection ? String(material.warehouseSection) : "")) {
          updateData.warehouseSection = formData.warehouseSection || undefined
        }
        if (formData.warehouseLevel !== (material?.warehouseLevel != null ? String(material.warehouseLevel) : "")) {
          const levelNumber = Number(formData.warehouseLevel)
          if (!Number.isNaN(levelNumber) && levelNumber > 0) {
            updateData.warehouseLevel = levelNumber
          }
        }
        if (formData.warehouseX !== (material?.warehouseX !== undefined ? String(material.warehouseX) : "")) {
          updateData.warehouseX = formData.warehouseX !== "" ? Number(formData.warehouseX) : undefined
        }
        if (formData.warehouseY !== (material?.warehouseY !== undefined ? String(material.warehouseY) : "")) {
          updateData.warehouseY = formData.warehouseY !== "" ? Number(formData.warehouseY) : undefined
        }
        
        // Solo incluir stock si allowStockEdit es true (para casos especiales)
        if (allowStockEdit && formData.stock !== material?.availableStock && Number(formData.stock) >= 0) {
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
          threshold: Number(formData.threshold),
        }
        
        // Agregar campos opcionales solo si tienen valor
        if (formData.supplier.trim()) createData.supplier = formData.supplier
        if (formData.value !== "" && Number(formData.value) >= 0) createData.value = Number(formData.value)
        if (formData.stock !== "" && Number(formData.stock) >= 0) createData.stock = Number(formData.stock)
        if (formData.warehouseZone) createData.warehouseZone = formData.warehouseZone
        if (formData.warehouseSection) createData.warehouseSection = formData.warehouseSection
        const levelNumber = Number(formData.warehouseLevel)
        if (!Number.isNaN(levelNumber) && levelNumber > 0) {
          createData.warehouseLevel = levelNumber
        }
        if (formData.warehouseX !== "") createData.warehouseX = Number(formData.warehouseX)
        if (formData.warehouseY !== "") createData.warehouseY = Number(formData.warehouseY)
        
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-background p-4 rounded-lg">
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
            onChange={(e) => handleChange("value", e.target.value)}
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
              <span className="text-xs text-gray-500 ml-2">(Solo lectura)</span>
            )}
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
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
                Para modificar el stock, usa la sección de Movimientos
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
            onChange={(e) => handleChange("threshold", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.threshold ? "border-red-500" : "border-stroke"
            }`}
            placeholder="0.00"
          />
          {errors.threshold && <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-stroke">
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Zona de almacén
          </label>
          <select
            value={formData.warehouseZone}
            onChange={(e) => handleChange("warehouseZone", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="">Selecciona una zona</option>
            {zoneOptions.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          {loadingWarehouseInfo && <p className="text-xs text-muted mt-1">Cargando zonas...</p>}
          {warehouseError && <p className="text-xs text-alert-600 mt-1">{warehouseError}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Sección
          </label>
          <select
            value={formData.warehouseSection}
            onChange={(e) => handleChange("warehouseSection", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.warehouseSection ? "border-red-500" : "border-stroke"
            }`}
            disabled={!formData.warehouseZone}
          >
            <option value="">{formData.warehouseZone ? "Selecciona una sección" : "Selecciona una zona primero"}</option>
            {sectionsForZone.map((section: string) => (
              <option key={section} value={section}>
                {section}
              </option>
            ))}
          </select>
          {errors.warehouseSection && <p className="text-red-500 text-sm mt-1">{errors.warehouseSection}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Nivel
          </label>
          <input
            type="number"
            min="1"
            value={formData.warehouseLevel}
            onChange={(e) => handleChange("warehouseLevel", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            placeholder="1"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Coordenada X
            </label>
            <input
              type="number"
              min="0"
              value={formData.warehouseX}
              onChange={(e) => handleChange("warehouseX", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                errors.warehouseX ? "border-red-500" : "border-stroke"
              }`}
              placeholder="0"
            />
            {errors.warehouseX && <p className="text-red-500 text-sm mt-1">{errors.warehouseX}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-900 mb-2">
              Coordenada Y
            </label>
            <input
              type="number"
              min="0"
              value={formData.warehouseY}
              onChange={(e) => handleChange("warehouseY", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
                errors.warehouseY ? "border-red-500" : "border-stroke"
              }`}
              placeholder="0"
            />
            {errors.warehouseY && <p className="text-red-500 text-sm mt-1">{errors.warehouseY}</p>}
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
          {isLoading ? "Guardando..." : material ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  )
}

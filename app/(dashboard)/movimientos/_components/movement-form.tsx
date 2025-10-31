"use client"

/**
 * Formulario para crear movimientos de stock
 */

import { useState, useEffect } from "react"
import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { getMaterialsIdNameList, type MaterialIdName } from "@/lib/materials-api"
import type { MovementType, MovementCreateRequest } from "@/types"

interface MovementFormProps {
  onSubmit: (data: MovementCreateRequest) => void
  onCancel: () => void
  isLoading?: boolean
}

export function MovementForm({ onSubmit, onCancel, isLoading = false }: MovementFormProps) {
  const [formData, setFormData] = useState({
    materialId: "",
    type: "INGRESO" as MovementType,
    stock: "",
    reason: "",
    location: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [materials, setMaterials] = useState<MaterialIdName[]>([])
  const [loadingMaterials, setLoadingMaterials] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  // Buscar materiales cuando cambie el término de búsqueda
  useEffect(() => {
    const searchMaterials = async () => {
      // No buscar si no hay término de búsqueda o si ya tenemos un material seleccionado
      if (!searchTerm.trim()) {
        setMaterials([])
        return
      }

      setLoadingMaterials(true)
      try {
        // Siempre buscar solo materiales activos para creación de movimientos
        const materialsList = await getMaterialsIdNameList({
          name: searchTerm,
          active: true
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

    if (!formData.materialId) {
      newErrors.materialId = "Debe seleccionar un material"
    }

    if (!formData.stock || formData.stock === "" || Number(formData.stock) <= 0) {
      newErrors.stock = "La cantidad debe ser mayor a 0"
    }

    if (!formData.location.trim()) {
      newErrors.location = "La ubicación es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      const createData: MovementCreateRequest = {
        materialId: formData.materialId,
        type: formData.type,
        stock: Number(formData.stock),
        reason: formData.reason.trim() || undefined,
        location: formData.location.trim()
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
    }
  }

  // Obtener el material seleccionado desde el estado local
  const selectedMaterial = formData.materialId ? 
    materials.find(m => m.id.toString() === formData.materialId) : null
  const isIngreso = formData.type === 'INGRESO'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Material */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Material *
          </label>
          
          {/* Campo de búsqueda */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar material por nombre..."
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
            <div className="absolute z-50 w-155 mt-1 max-h-32 overflow-y-auto border border-stroke rounded-lg bg-white shadow-lg">
              {materials.length === 0 && !loadingMaterials ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No se encontraron materiales
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

        {/* Tipo de Movimiento */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Tipo de Movimiento *
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleChange("type", e.target.value as MovementType)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
          >
            <option value="INGRESO">Ingreso</option>
            <option value="EGRESO">Egreso</option>
          </select>
          
          {/* Indicador visual del tipo */}
          <div className="mt-2 flex items-center gap-2">
            {isIngreso ? (
              <ArrowUp className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDown className="w-4 h-4 text-red-600" />
            )}
            <span className={cn(
              "text-sm font-medium",
              isIngreso ? "text-green-800" : "text-red-800"
            )}>
              {isIngreso ? 'Aumentará el stock' : 'Disminuirá el stock'}
            </span>
          </div>
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
            value={formData.stock}
            onChange={(e) => handleChange("stock", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.stock ? "border-red-500" : "border-stroke"
            }`}
            placeholder="0.00"
          />
          {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Ubicación *
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 ${
              errors.location ? "border-red-500" : "border-stroke"
            }`}
            placeholder="Ej: Almacén Principal, Zona de Producción"
          />
          {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Motivo */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Motivo <span className="text-gray-500">(opcional)</span>
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleChange("reason", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            rows={3}
            placeholder="Ej: Compra de insumos, Producción de lote #123"
          />
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
          disabled={isLoading || loadingMaterials}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Guardando..." : "Crear Movimiento"}
        </button>
      </div>
    </form>
  )
}

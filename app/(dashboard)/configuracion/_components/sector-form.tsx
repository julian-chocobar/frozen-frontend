"use client"

/**
 * Componente de formulario para crear/editar sectores
 * Separado del tab principal para mejor organización y reutilización
 * Estilo consistente con material-form.tsx
 */

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { 
  SectorResponse, 
  SectorCreateRequest, 
  SectorUpdateRequest, 
  SectorType, 
  Phase
} from "@/types"

const SECTOR_TYPES: { value: SectorType; label: string }[] = [
  { value: "PRODUCCION", label: "Producción" },
  { value: "CALIDAD", label: "Calidad" },
  { value: "ALMACEN", label: "Almacén" }
]

const PHASES: Phase[] = [
  "MOLIENDA",
  "MACERACION",
  "FILTRACION",
  "COCCION",
  "FERMENTACION",
  "MADURACION",
  "GASIFICACION",
  "ENVASADO",
  "DESALCOHOLIZACION"
]

interface SectorFormProps {
  /** Datos iniciales del sector (para edición) */
  initial?: SectorResponse | null
  /** Función que se ejecuta al enviar el formulario */
  onSubmit: (data: SectorCreateRequest | SectorUpdateRequest) => Promise<void>
  /** Función que se ejecuta al cancelar */
  onCancel: () => void
  /** Indica si el formulario está en estado de carga */
  isLoading: boolean
}

export function SectorForm({ initial, onSubmit, onCancel, isLoading }: SectorFormProps) {
  const [formData, setFormData] = useState({
    name: initial?.name || "",
    supervisorId: initial?.supervisorId?.toString() || "",
    type: initial?.type || "PRODUCCION" as SectorType,
    phase: initial?.phase || null as Phase | null,
    productionCapacity: initial?.productionCapacity?.toString() || "",
    isTimeActive: initial?.isTimeActive ?? true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    }

    if (!formData.supervisorId || Number(formData.supervisorId) <= 0) {
      newErrors.supervisorId = "El ID del supervisor debe ser mayor a 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const submitData: SectorCreateRequest | SectorUpdateRequest = {
      name: formData.name,
      supervisorId: parseInt(formData.supervisorId),
      type: formData.type,
      phase: formData.phase || null,
      productionCapacity: formData.productionCapacity ? parseFloat(formData.productionCapacity) : null,
      isTimeActive: formData.isTimeActive
    }
    
    await onSubmit(submitData)
  }

  const handleChange = (field: string, value: string | boolean | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
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
            Nombre del Sector *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: Sector de Producción 1"
            disabled={isLoading}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* ID del Supervisor */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            ID del Supervisor *
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.supervisorId}
            onChange={(e) => handleChange("supervisorId", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: 1"
            disabled={isLoading}
          />
          {errors.supervisorId && <p className="text-red-500 text-sm mt-1">{errors.supervisorId}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Tipo de Sector *
          </label>
          <Select
            value={formData.type}
            onValueChange={(value) => handleChange("type", value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="z-[100] bg-white">
              {SECTOR_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type}</p>}
        </div>

        {/* Fase */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Fase (opcional)
          </label>
          <Select
            value={formData.phase || "NONE"}
            onValueChange={(value) => handleChange("phase", value === "NONE" ? null : value)}
            disabled={isLoading}
          >
            <SelectTrigger className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500">
              <SelectValue placeholder="Seleccionar fase" />
            </SelectTrigger>
            <SelectContent className="z-[100] bg-white">
              <SelectItem value="NONE">Ninguna</SelectItem>
              {PHASES.map((phase) => (
                <SelectItem key={phase} value={phase}>
                  {phase}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Capacidad de Producción */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Capacidad de Producción (opcional)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.productionCapacity}
            onChange={(e) => handleChange("productionCapacity", e.target.value)}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="0.00"
            disabled={isLoading}
          />
        </div>

        {/* Tiempo Activo */}
        <div className="flex items-center space-x-2 pt-8">
          <input
            type="checkbox"
            id="isTimeActive"
            checked={formData.isTimeActive}
            onChange={(e) => handleChange("isTimeActive", e.target.checked)}
            disabled={isLoading}
            className="w-6 h-6 text-primary-600 bg-primary-50 border-primary-300 rounded focus:ring-primary-500 focus:ring-2"
          />
          <label htmlFor="isTimeActive" className="text-sm font-medium text-primary-900 cursor-pointer">
            Tiempo activo
          </label>
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
          {isLoading ? "Guardando..." : initial ? "Actualizar Sector" : "Crear Sector"}
        </button>
      </div>
    </form>
  )
}


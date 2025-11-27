"use client"

/**
 * Componente de formulario para crear/editar parámetros de calidad
 * Separado del tab principal para mejor organización y reutilización
 */

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { 
  QualityParameterResponse, 
  QualityParameterCreateRequest, 
  QualityParameterUpdateRequest,
  Phase 
} from "@/types"

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

interface QualityParameterFormProps {
  /** Datos iniciales del parámetro (para edición) */
  initial?: QualityParameterResponse | null
  /** Función que se ejecuta al enviar el formulario */
  onSubmit: (data: QualityParameterCreateRequest | QualityParameterUpdateRequest) => Promise<void>
  /** Función que se ejecuta al cancelar */
  onCancel: () => void
  /** Indica si el formulario está en estado de carga */
  isLoading: boolean
}

export function QualityParameterForm({ 
  initial, 
  onSubmit, 
  onCancel, 
  isLoading 
}: QualityParameterFormProps) {
  const [formData, setFormData] = useState({
    phase: initial?.phase || "MOLIENDA" as Phase,
    isCritical: initial?.isCritical ?? false,
    name: initial?.name || "",
    description: initial?.description || "",
    unit: initial?.unit || "",
    information: initial?.information || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (initial) {
      // Update - solo campos editables
      const updateData: QualityParameterUpdateRequest = {
        description: formData.description || null,
        unit: formData.unit || null,
        information: formData.information || null
      }
      await onSubmit(updateData)
    } else {
      // Create - todos los campos
      const createData: QualityParameterCreateRequest = {
        phase: formData.phase,
        isCritical: formData.isCritical,
        name: formData.name,
        description: formData.description || null,
        unit: formData.unit || null,
        information: formData.information || null
      }
      await onSubmit(createData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Información básica */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {!initial && (
          <>
            {/* Fase */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Fase *
              </label>
              <Select
                value={formData.phase}
                onValueChange={(value) => setFormData({ ...formData, phase: value as Phase })}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="z-[100] bg-white">
                  {PHASES.map((phase) => (
                    <SelectItem key={phase} value={phase}>
                      {phase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-primary-900 mb-2">
                Nombre *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                maxLength={20}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
                placeholder="Ej: Temperatura"
              />
              <p className="text-xs text-primary-600 mt-1">Máximo 20 caracteres</p>
            </div>

            {/* Es crítico */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCritical"
                checked={formData.isCritical}
                onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
                disabled={isLoading}
                className="w-6 h-6 text-primary-600 bg-primary-50 border-primary-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <label htmlFor="isCritical" className="text-sm font-medium text-primary-900 cursor-pointer">
                Es crítico *
              </label>
            </div>
          </>
        )}

        {/* Descripción */}
        <div className={initial ? "" : "md:col-span-2"}>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Descripción (opcional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            maxLength={255}
            rows={3}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Descripción del parámetro"
          />
          <p className="text-xs text-primary-600 mt-1">Máximo 255 caracteres</p>
        </div>

        {/* Unidad */}
        <div>
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Unidad (opcional)
          </label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            maxLength={50}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: °C, kg, L"
          />
          <p className="text-xs text-primary-600 mt-1">Máximo 50 caracteres</p>
        </div>

        {/* Información */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-primary-900 mb-2">
            Información (opcional)
          </label>
          <textarea
            value={formData.information}
            onChange={(e) => setFormData({ ...formData, information: e.target.value })}
            maxLength={500}
            rows={4}
            disabled={isLoading}
            className="w-full px-3 py-2 border border-stroke rounded-lg focus:ring-primary-500 focus:border-primary-500"
            placeholder="Información adicional sobre el parámetro"
          />
          <p className="text-xs text-primary-600 mt-1">Máximo 500 caracteres</p>
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
          {isLoading ? "Guardando..." : initial ? "Actualizar Parámetro" : "Crear Parámetro"}
        </button>
      </div>
    </form>
  )
}


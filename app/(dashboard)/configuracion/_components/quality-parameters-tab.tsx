"use client"

import { useState, useEffect } from "react"
import { 
  getQualityParameters, 
  createQualityParameter, 
  updateQualityParameter,
  toggleQualityParameterActive 
} from "@/lib/quality-parameters-api"
import type { 
  QualityParameterResponse, 
  QualityParameterCreateRequest, 
  QualityParameterUpdateRequest,
  Phase 
} from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, X, Power } from "lucide-react"
import { handleError, showSuccess } from "@/lib/error-handler"
import { cn } from "@/lib/utils"

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
  initial?: QualityParameterResponse | null
  onSubmit: (data: QualityParameterCreateRequest | QualityParameterUpdateRequest) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

function QualityParameterForm({ initial, onSubmit, onCancel, isLoading }: QualityParameterFormProps) {
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
      // Update
      const updateData: QualityParameterUpdateRequest = {
        description: formData.description || null,
        unit: formData.unit || null,
        information: formData.information || null
      }
      await onSubmit(updateData)
    } else {
      // Create
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {!initial && (
        <>
          <div className="space-y-2">
            <Label htmlFor="phase">Fase *</Label>
            <Select
              value={formData.phase}
              onValueChange={(value) => setFormData({ ...formData, phase: value as Phase })}
              disabled={isLoading}
            >
              <SelectTrigger className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                {PHASES.map((phase) => (
                  <SelectItem key={phase} value={phase}>
                    {phase}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isCritical"
              checked={formData.isCritical}
              onChange={(e) => setFormData({ ...formData, isCritical: e.target.checked })}
              disabled={isLoading}
              className="w-6 h-6 text-primary-600 bg-primary-50 border-primary-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <Label htmlFor="isCritical" className="cursor-pointer">
              Es crítico *
            </Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              maxLength={20}
              required
              disabled={isLoading}
              className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            <p className="text-xs text-primary-600">Máximo 20 caracteres</p>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          maxLength={255}
          rows={3}
          disabled={isLoading}
          className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <p className="text-xs text-primary-600">Máximo 255 caracteres</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unidad (opcional)</Label>
        <Input
          id="unit"
          value={formData.unit}
          onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
          maxLength={50}
          disabled={isLoading}
          className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <p className="text-xs text-primary-600">Máximo 50 caracteres</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="information">Información (opcional)</Label>
        <Textarea
          id="information"
          value={formData.information}
          onChange={(e) => setFormData({ ...formData, information: e.target.value })}
          maxLength={500}
          rows={4}
          disabled={isLoading}
          className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <p className="text-xs text-primary-600">Máximo 500 caracteres</p>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading} className="border border-primary-200 hover:bg-primary-50">
          <X className="w-4 h-4 mr-2" />
          Cancelar
        </Button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  )
}

export function QualityParametersTab() {
  const [parameters, setParameters] = useState<QualityParameterResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<QualityParameterResponse | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)

  const loadParameters = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getQualityParameters()
      setParameters(data)
    } catch (err) {
      console.error("Error loading quality parameters:", err)
      const errorMessage = err instanceof Error ? err.message : "Error al cargar parámetros de calidad"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadParameters()
  }, [])

  const handleCreate = async (data: QualityParameterCreateRequest) => {
    try {
      setSaving(true)
      await createQualityParameter(data)
      showSuccess("Parámetro de calidad creado exitosamente")
      setIsCreating(false)
      await loadParameters()
    } catch (error) {
      handleError(error, { title: "Error al crear parámetro de calidad" })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async (data: QualityParameterUpdateRequest) => {
    if (!selected) return
    try {
      setSaving(true)
      await updateQualityParameter(selected.id, data)
      showSuccess("Parámetro de calidad actualizado exitosamente")
      setSelected(null)
      await loadParameters()
    } catch (error) {
      handleError(error, { title: "Error al actualizar parámetro de calidad" })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (id: number) => {
    try {
      await toggleQualityParameterActive(id)
      showSuccess("Estado del parámetro actualizado exitosamente")
      await loadParameters()
    } catch (error) {
      handleError(error, { title: "Error al cambiar estado del parámetro" })
    }
  }

  if (loading) {
    return (
      <div className="card p-8 border-2 border-primary-600 text-center">
        <LoadingSpinner />
        <p className="mt-4 text-primary-600">Cargando parámetros de calidad...</p>
      </div>
    )
  }

  if (error && parameters.length === 0) {
    return (
      <div className="card p-6 border-2 border-primary-600">
        <ErrorState error={error} />
      </div>
    )
  }

  return (
    <>
      <div className="card p-6 border-2 border-primary-600">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-primary-900">Parámetros de Calidad</h3>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Parámetro
          </Button>
        </div>

        {/* Tabla desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b border-primary-200">
                <th className="py-2 pr-4 text-primary-700 font-medium">Nombre</th>
                <th className="py-2 pr-4 text-primary-700 font-medium">Fase</th>
                <th className="py-2 pr-4 text-primary-700 font-medium">Crítico</th>
                <th className="py-2 pr-4 text-primary-700 font-medium">Unidad</th>
                <th className="py-2 pr-4 text-primary-700 font-medium">Estado</th>
                <th className="py-2 pr-4 text-primary-700 font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {parameters.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-primary-600">
                    No hay parámetros de calidad registrados
                  </td>
                </tr>
              ) : (
                parameters.map((param) => (
                  <tr key={param.id} className="border-b border-primary-100 last:border-0 hover:bg-primary-50">
                    <td className="py-3 pr-4">
                      <div className="font-medium text-primary-900">{param.name}</div>
                      {param.description && (
                        <div className="text-xs text-primary-600 mt-1">{param.description}</div>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-primary-600">{param.phase}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                        param.isCritical
                          ? "bg-red-100 text-red-700 border-red-200"
                          : "bg-primary-50 text-primary-700 border-primary-200"
                      )}>
                        {param.isCritical ? "Sí" : "No"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className="text-primary-600">{param.unit || "-"}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={cn(
                        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                        param.isActive
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-primary-50 text-primary-700 border-primary-200"
                      )}>
                        {param.isActive ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelected(param)}
                          className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                          aria-label="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleToggleActive(param.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-0"
                          aria-label={param.isActive ? "Desactivar" : "Activar"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Cards mobile */}
        <div className="md:hidden space-y-4">
          {parameters.length === 0 ? (
            <div className="text-center py-8 text-primary-600">
              No hay parámetros de calidad registrados
            </div>
          ) : (
            parameters.map((param) => (
              <div key={param.id} className="bg-surface border border-stroke rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-primary-900">{param.name}</h4>
                    <p className="text-sm text-primary-600">{param.phase}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelected(param)}
                      className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                      aria-label="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleToggleActive(param.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-0"
                      aria-label={param.isActive ? "Desactivar" : "Activar"}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {param.description && (
                  <p className="text-sm text-primary-700 mb-2">{param.description}</p>
                )}
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                    param.isCritical
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-primary-50 text-primary-700 border-primary-200"
                  )}>
                    {param.isCritical ? "Crítico" : "No crítico"}
                  </span>
                  <span className={cn(
                    "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
                    param.isActive
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-primary-50 text-primary-700 border-primary-200"
                  )}>
                    {param.isActive ? "Activo" : "Inactivo"}
                  </span>
                  {param.unit && (
                    <span className="text-xs text-primary-600">Unidad: {param.unit}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal crear */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary-200 shadow-2xl">
          <DialogTitle className="text-xl font-semibold text-primary-900 mb-4">Crear Nuevo Parámetro de Calidad</DialogTitle>
          <QualityParameterForm
            onSubmit={handleCreate as (data: QualityParameterCreateRequest | QualityParameterUpdateRequest) => Promise<void>}
            onCancel={() => setIsCreating(false)}
            isLoading={saving}
          />
        </DialogContent>
      </Dialog>

      {/* Modal editar */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary-200 shadow-2xl">
          <DialogTitle className="text-xl font-semibold text-primary-900 mb-4">Editar Parámetro de Calidad</DialogTitle>
          {selected && (
            <QualityParameterForm
              initial={selected}
              onSubmit={handleUpdate as (data: QualityParameterCreateRequest | QualityParameterUpdateRequest) => Promise<void>}
              onCancel={() => setSelected(null)}
              isLoading={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


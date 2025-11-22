"use client"

import { useState, useEffect } from "react"
import { updateSector, getAllSectors } from "@/lib/sectors"
import type { SectorResponse, SectorCreateRequest, SectorUpdateRequest, SectorType, Phase } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X } from "lucide-react"
import { handleError, showSuccess } from "@/lib/error-handler"
import { getUsers } from "@/lib/users"
import type { UserResponse } from "@/types"

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

// Función para formatear las fases a título (primera letra mayúscula, resto minúsculas)
const formatPhase = (phase: Phase | null): string => {
  if (!phase) return "-"
  return phase.charAt(0).toUpperCase() + phase.slice(1).toLowerCase()
}

interface SectorFormProps {
  initial?: SectorResponse | null
  onSubmit: (data: SectorCreateRequest | SectorUpdateRequest) => Promise<void>
  onCancel: () => void
  isLoading: boolean
}

function SectorForm({ initial, onSubmit, onCancel, isLoading }: SectorFormProps) {
  const [formData, setFormData] = useState({
    name: initial?.name || "",
    supervisorId: initial?.supervisorId?.toString() || "",
    type: initial?.type || "PRODUCCION" as SectorType,
    phase: initial?.phase || null as Phase | null,
    productionCapacity: initial?.productionCapacity?.toString() || "",
    isTimeActive: initial?.isTimeActive ?? true
  })
  const [supervisors, setSupervisors] = useState<UserResponse[]>([])
  const [loadingSupervisors, setLoadingSupervisors] = useState(false)

  useEffect(() => {
    const loadSupervisors = async () => {
      setLoadingSupervisors(true)
      try {
        const data = await getUsers({ page: 0, size: 100 })
        setSupervisors(data.users)
      } catch (error) {
        console.error("Error loading supervisors:", error)
      } finally {
        setLoadingSupervisors(false)
      }
    }
    loadSupervisors()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submitData: any = {
      name: formData.name,
      supervisorId: parseInt(formData.supervisorId),
      type: formData.type,
      phase: formData.phase || null,
      productionCapacity: formData.productionCapacity ? parseFloat(formData.productionCapacity) : null,
      isTimeActive: formData.isTimeActive
    }
    await onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nombre *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          disabled={isLoading}
          className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="supervisorId">Supervisor *</Label>
        <Select
          value={formData.supervisorId}
          onValueChange={(value) => setFormData({ ...formData, supervisorId: value })}
          disabled={isLoading || loadingSupervisors}
        >
          <SelectTrigger className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 w-full">
            <SelectValue placeholder="Seleccionar supervisor" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {supervisors.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.name || user.username}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo *</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => setFormData({ ...formData, type: value as SectorType })}
          disabled={isLoading}
        >
          <SelectTrigger className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {SECTOR_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phase">Fase (opcional)</Label>
        <Select
          value={formData.phase || "NONE"}
          onValueChange={(value) => setFormData({ ...formData, phase: value === "NONE" ? null : value as Phase })}
          disabled={isLoading}
        >
          <SelectTrigger className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 w-full">
            <SelectValue placeholder="Seleccionar fase" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="NONE">Ninguna</SelectItem>
            {PHASES.map((phase) => (
              <SelectItem key={phase} value={phase}>
                {phase}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="productionCapacity">Capacidad de Producción (opcional)</Label>
        <Input
          id="productionCapacity"
          type="number"
          step="0.01"
          min="0"
          value={formData.productionCapacity}
          onChange={(e) => setFormData({ ...formData, productionCapacity: e.target.value })}
          disabled={isLoading}
          className="border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isTimeActive"
          checked={formData.isTimeActive}
          onChange={(e) => setFormData({ ...formData, isTimeActive: e.target.checked })}
          disabled={isLoading}
          className="w-6 h-6 text-primary-600 bg-primary-50 border-primary-300 rounded focus:ring-primary-500 focus:ring-2"
        />
        <Label htmlFor="isTimeActive" className="cursor-pointer">
          Tiempo activo
        </Label>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
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

export function SectorsTab() {
  const [sectors, setSectors] = useState<SectorResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<SectorResponse | null>(null)
  const [saving, setSaving] = useState(false)

  const loadSectors = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllSectors(0, 100)
      setSectors(data.sectors)
    } catch (err) {
      handleError(err, { title: "Error al cargar sectores" })
      setSectors([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSectors()
  }, [])

  const handleUpdate = async (data: SectorUpdateRequest) => {
    if (!selected || !selected.id) {
      showSuccess("Error: No se puede identificar el sector a actualizar", "error")
      return
    }
    try {
      setSaving(true)
      await updateSector(selected.id, data)
      showSuccess("Sector actualizado exitosamente")
      setSelected(null)
      await loadSectors()
    } catch (error) {
      handleError(error, { title: "Error al actualizar sector" })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="card p-6 border-2 border-primary-600">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-primary-900">Sectores</h3>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorState error={error} />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
            <p className="ml-4 text-primary-600">Cargando sectores...</p>
          </div>
        )}

        {/* Tabla desktop */}
        {!loading && sectors.length > 0 && (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-primary-200">
                    <th className="py-2 pr-4 text-primary-700 font-medium">ID</th>
                    <th className="py-2 pr-4 text-primary-700 font-medium">Nombre</th>
                    <th className="py-2 pr-4 text-primary-700 font-medium">Tipo</th>
                    <th className="py-2 pr-4 text-primary-700 font-medium">Fase</th>
                    <th className="py-2 pr-4 text-primary-700 font-medium">Capacidad</th>
                    <th className="py-2 pr-4 text-primary-700 font-medium">Activo</th>
                    <th className="py-2 pr-4 text-primary-700 font-medium">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {sectors.map((sector) => (
                    <tr key={sector.id || `sector-${sector.name}`} className="border-b border-primary-100 last:border-0 hover:bg-primary-50">
                      <td className="py-3 pr-4">
                        <span className="text-sm text-primary-600">{sector.id || "-"}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm font-medium text-primary-900">{sector.name}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-primary-600">{SECTOR_TYPES.find(t => t.value === sector.type)?.label || sector.type}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-primary-600">{formatPhase(sector.phase)}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className="text-sm text-primary-600">{sector.productionCapacity || "-"}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`text-sm ${sector.isTimeActive ? "text-green-600" : "text-primary-600"}`}>
                          {sector.isTimeActive ? "Sí" : "No"}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <button
                          onClick={() => setSelected(sector)}
                          className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                          aria-label="Editar"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards mobile */}
            <div className="md:hidden space-y-4">
              {sectors.map((sector) => (
                <div key={sector.id || `sector-${sector.name}`} className="bg-surface border border-stroke rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-primary-900">{sector.name}</h4>
                      <p className="text-sm text-primary-600">
                        ID: {sector.id || "-"} • {SECTOR_TYPES.find(t => t.value === sector.type)?.label || sector.type}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelected(sector)}
                      className="p-2 hover:bg-primary-50 rounded-lg transition-colors text-primary-600"
                      aria-label="Editar"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary-600">Fase:</span>
                      <span className="text-primary-900">{formatPhase(sector.phase)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Capacidad:</span>
                      <span className="text-primary-900">{sector.productionCapacity || "-"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">Activo:</span>
                      <span className={`${sector.isTimeActive ? "text-green-600" : "text-primary-600"}`}>
                        {sector.isTimeActive ? "Sí" : "No"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {!loading && sectors.length === 0 && (
          <div className="text-center py-8 text-primary-600">
            <p>No hay sectores disponibles.</p>
          </div>
        )}
      </div>

      {/* Modal editar */}
      <Dialog open={!!selected} onOpenChange={(v) => !v && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-primary-200 shadow-2xl">
          <DialogTitle className="text-xl font-semibold text-primary-900 mb-4">Editar Sector</DialogTitle>
          {selected && (
            <SectorForm
              initial={selected}
              onSubmit={handleUpdate as (data: SectorCreateRequest | SectorUpdateRequest) => Promise<void>}
              onCancel={() => setSelected(null)}
              isLoading={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}


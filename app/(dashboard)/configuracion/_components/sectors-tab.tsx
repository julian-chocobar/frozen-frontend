"use client"

import { useState, useEffect } from "react"
import { updateSector, getAllSectors, createSector } from "@/lib/sectors"
import type { SectorResponse, SectorCreateRequest, SectorUpdateRequest, SectorType, Phase } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, X } from "lucide-react"
import { handleError, showSuccess } from "@/lib/error-handler"
import { getUsers } from "@/lib/users"
import type { UserResponse } from "@/types"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import { DataCards, type CardLayout } from "@/components/ui/data-cards"
import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { cn } from "@/lib/utils"

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
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <X className="w-4 h-4" />
          Cancelar
        </button>
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
  const { isOpen: isCreating, isLoading: isCreatingLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Sector creado exitosamente',
    errorTitle: 'Error al crear sector'
  })

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

  const handleCreate = async (data: SectorCreateRequest) => {
    await handleSubmit(async () => {
      await createSector(data)
      await loadSectors()
    })
  }

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

  const columns: ColumnDef<SectorResponse>[] = [
    {
      key: 'id',
      label: 'ID',
      render: (value) => (
        <span className="text-sm font-mono text-primary-600">#{value || "-"}</span>
      )
    },
    {
      key: 'name',
      label: 'Nombre',
      render: (value) => (
        <span className="text-sm font-medium text-primary-900">{value}</span>
      )
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (value) => (
        <span className="text-sm text-primary-600">{SECTOR_TYPES.find(t => t.value === value)?.label || value}</span>
      )
    },
    {
      key: 'phase',
      label: 'Fase',
      render: (value) => (
        <span className="text-sm text-primary-600">{formatPhase(value)}</span>
      )
    },
    {
      key: 'productionCapacity',
      label: 'Capacidad',
      render: (value) => (
        <span className="text-sm text-primary-600">{value || "-"}</span>
      )
    },
    {
      key: 'isTimeActive',
      label: 'Activo',
      render: (value) => (
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
          value
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-primary-50 text-primary-700 border-primary-200"
        )}>
          {value ? "Sí" : "No"}
        </span>
      )
    }
  ]

  const cardLayout: CardLayout<SectorResponse> = {
    header: [
      {
        key: 'id',
        label: '',
        showLabel: false,
        render: (value) => (
          <p className="text-xs font-mono text-primary-600 mb-1">#{value || "-"}</p>
        )
      },
      {
        key: 'name',
        label: '',
        showLabel: false,
        render: (value) => (
          <h3 className="text-base font-semibold text-primary-900">{value}</h3>
        )
      }
    ],
    content: [
      {
        key: 'type',
        label: 'Tipo',
        render: (value) => (
          <span className="text-sm text-primary-600">{SECTOR_TYPES.find(t => t.value === value)?.label || value}</span>
        )
      },
      {
        key: 'phase',
        label: 'Fase',
        render: (value) => (
          <span className="text-sm text-primary-600">{formatPhase(value)}</span>
        )
      },
      {
        key: 'productionCapacity',
        label: 'Capacidad',
        render: (value) => (
          <span className="text-sm text-primary-900">{value || "-"}</span>
        )
      },
      {
        key: 'isTimeActive',
        label: 'Activo',
        render: (value) => (
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
            value
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-primary-50 text-primary-700 border-primary-200"
          )}>
            {value ? "Sí" : "No"}
          </span>
        )
      }
    ]
  }

  const actions: TableActions<SectorResponse> = {
    onEdit: (sector) => setSelected(sector)
  }

  return (
    <>
      <div className="card border-2 border-primary-600 overflow-hidden">
        <div className="p-6 border-b border-stroke">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary-900 mb-1">Sectores</h2>
              <p className="text-sm text-primary-600">Gestiona los sectores de producción</p>
            </div>
            {!loading && !error && (
              <CreateButton
                buttonText="Nuevo"
                modalTitle="Crear Nuevo Sector"
                ariaLabel="Agregar nuevo sector"
                isOpen={isCreating}
                onOpen={openModal}
              >
                <SectorForm
                  onSubmit={handleCreate}
                  onCancel={closeModal}
                  isLoading={isCreatingLoading}
                />
              </CreateButton>
            )}
          </div>
        </div>

        {error && (
          <div className="p-6">
            <ErrorState error={error} />
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner />
            <p className="ml-4 text-primary-600">Cargando sectores...</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                data={sectors}
                columns={columns}
                actions={actions}
                emptyMessage="No hay sectores disponibles"
              />
            </div>
            <div className="md:hidden">
              <DataCards
                data={sectors}
                layout={cardLayout}
                actions={actions}
                emptyMessage="No hay sectores disponibles"
                className="space-y-4"
              />
            </div>
          </>
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


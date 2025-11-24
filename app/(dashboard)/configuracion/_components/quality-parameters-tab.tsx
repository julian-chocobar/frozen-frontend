"use client"

import { useState, useEffect } from "react"
import { 
  getQualityParameters, 
  createQualityParameter, 
  updateQualityParameter,
  toggleQualityParameterActive 
} from "@/lib/quality/quality-parameters-api"
import type { 
  QualityParameterResponse, 
  QualityParameterCreateRequest, 
  QualityParameterUpdateRequest,
  Phase 
} from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, X, Power, PowerOff } from "lucide-react"
import { handleError, showSuccess } from "@/lib/error-handler"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import { DataCards, type CardLayout } from "@/components/ui/data-cards"
import { CreateButton, useCreateModal } from "@/components/ui/create-button"

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

export function QualityParametersTab() {
  const [parameters, setParameters] = useState<QualityParameterResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<QualityParameterResponse | null>(null)
  const [saving, setSaving] = useState(false)
  const { isOpen: isCreating, isLoading: isCreatingLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Parámetro de calidad creado exitosamente',
    errorTitle: 'Error al crear parámetro de calidad'
  })

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
    await handleSubmit(async () => {
      await createQualityParameter(data)
      await loadParameters()
    })
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

  const columns: ColumnDef<QualityParameterResponse>[] = [
    {
      key: 'name',
      label: 'Nombre',
      render: (value, param) => (
        <div>
          <div className="font-medium text-primary-900">{value}</div>
          {param.description && (
            <div className="text-xs text-primary-600 mt-1">{param.description}</div>
          )}
        </div>
      )
    },
    {
      key: 'phase',
      label: 'Fase',
      render: (value) => (
        <span className="text-sm text-primary-600">{value}</span>
      )
    },
    {
      key: 'isCritical',
      label: 'Crítico',
      render: (value) => (
        <span className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
          value
            ? "bg-red-100 text-red-700 border-red-200"
            : "bg-primary-50 text-primary-700 border-primary-200"
        )}>
          {value ? "Sí" : "No"}
        </span>
      )
    },
    {
      key: 'unit',
      label: 'Unidad',
      render: (value) => (
        <span className="text-sm text-primary-600">{value || "-"}</span>
      )
    },
    {
      key: 'isActive',
      label: 'Estado',
      render: (value, param) => (
        <span className={cn(
          "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
          value
            ? "bg-green-100 text-green-700 border-green-200"
            : "bg-primary-50 text-primary-700 border-primary-200"
        )}>
          {value ? (
            <>
              <Power className="w-3 h-3" />
              Activo
            </>
          ) : (
            <>
              <PowerOff className="w-3 h-3" />
              Inactivo
            </>
          )}
        </span>
      )
    }
  ]

  const cardLayout: CardLayout<QualityParameterResponse> = {
    header: [
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
        key: 'phase',
        label: 'Fase',
        render: (value) => (
          <span className="text-sm text-primary-600">{value}</span>
        )
      },
      {
        key: 'description',
        label: 'Descripción',
        render: (value) => (
          <span className="text-sm text-primary-600">{value || "-"}</span>
        )
      },
      {
        key: 'unit',
        label: 'Unidad',
        render: (value) => (
          <span className="text-sm text-primary-900">{value || "-"}</span>
        )
      },
      {
        key: 'isCritical',
        label: 'Crítico',
        render: (value) => (
          <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
            value
              ? "bg-red-100 text-red-700 border-red-200"
              : "bg-primary-50 text-primary-700 border-primary-200"
          )}>
            {value ? "Sí" : "No"}
          </span>
        )
      }
    ],
    footer: [
      {
        key: 'isActive',
        label: '',
        showLabel: false,
        render: (value) => (
          <span className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border",
            value
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-primary-50 text-primary-700 border-primary-200"
          )}>
            {value ? (
              <>
                <Power className="w-3 h-3" />
                Activo
              </>
            ) : (
              <>
                <PowerOff className="w-3 h-3" />
                Inactivo
              </>
            )}
          </span>
        )
      }
    ]
  }

  const actions: TableActions<QualityParameterResponse> = {
    onEdit: (param) => setSelected(param),
    onToggleStatus: (param) => handleToggleActive(param.id),
    toggleStatusIcon: (param) => (
      param.isActive ? <PowerOff className="w-4 h-4 text-red-500" /> : <Power className="w-4 h-4 text-green-500" />
    )
  }

  return (
    <>
      <div className="card border-2 border-primary-600 overflow-hidden">
        <div className="p-6 border-b border-stroke">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary-900 mb-1">Parámetros de Calidad</h2>
              <p className="text-sm text-primary-600">Gestiona los parámetros de control de calidad</p>
            </div>
            {!loading && !error && (
              <CreateButton
                buttonText="Nuevo"
                modalTitle="Crear Nuevo Parámetro de Calidad"
                ariaLabel="Agregar nuevo parámetro de calidad"
                isOpen={isCreating}
                onOpen={openModal}
              >
                <QualityParameterForm
                  onSubmit={handleCreate as (data: QualityParameterCreateRequest | QualityParameterUpdateRequest) => Promise<void>}
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
            <p className="ml-4 text-primary-600">Cargando parámetros de calidad...</p>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <DataTable
                data={parameters}
                columns={columns}
                actions={actions}
                emptyMessage="No hay parámetros de calidad registrados"
              />
            </div>
            <div className="md:hidden">
              <DataCards
                data={parameters}
                layout={cardLayout}
                actions={actions}
                emptyMessage="No hay parámetros de calidad registrados"
                className="space-y-4"
              />
            </div>
          </>
        )}
      </div>

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


"use client"

/**
 * Tab de gestión de parámetros de calidad
 * Utiliza componentes separados para mejor organización
 */

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
  QualityParameterUpdateRequest
} from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Power, PowerOff } from "lucide-react"
import { handleError, showSuccess } from "@/lib/error-handler"
import { cn } from "@/lib/utils"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import { DataCards, type CardLayout } from "@/components/ui/data-cards"
import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { QualityParameterForm } from "./quality-parameter-form"

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


"use client"

/**
 * Tab de gestión de sectores
 * Utiliza componentes separados para mejor organización
 */

import { useState, useEffect } from "react"
import { updateSector, getAllSectors, createSector } from "@/lib/sectors"
import type { SectorResponse, SectorCreateRequest, SectorUpdateRequest, SectorType, Phase } from "@/types"
import { ErrorState } from "@/components/ui/error-state"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { handleError, showSuccess } from "@/lib/error-handler"
import { DataTable, type ColumnDef, type TableActions } from "@/components/ui/data-table"
import { DataCards, type CardLayout } from "@/components/ui/data-cards"
import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { SectorForm } from "./sector-form"
import { cn } from "@/lib/utils"

const SECTOR_TYPES: { value: SectorType; label: string }[] = [
  { value: "PRODUCCION", label: "Producción" },
  { value: "CALIDAD", label: "Calidad" },
  { value: "ALMACEN", label: "Almacén" }
]

// Función para formatear las fases a título (primera letra mayúscula, resto minúsculas)
const formatPhase = (phase: Phase | null): string => {
  if (!phase) return "-"
  return phase.charAt(0).toUpperCase() + phase.slice(1).toLowerCase()
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

  const handleCreate = async (data: SectorCreateRequest | SectorUpdateRequest) => {
    await handleSubmit(async () => {
      // En el modal de creación, siempre será SectorCreateRequest
      await createSector(data as SectorCreateRequest)
      await loadSectors()
    })
  }

  const handleUpdate = async (data: SectorCreateRequest | SectorUpdateRequest) => {
    if (!selected || !selected.id) {
      showSuccess("Error: No se puede identificar el sector a actualizar", "error")
      return
    }
    try {
      setSaving(true)
      await updateSector(selected.id, data as SectorUpdateRequest)
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


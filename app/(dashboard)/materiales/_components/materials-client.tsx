"use client"

/**
 * Componente cliente para manejar operaciones CRUD de materiales
 * Incluye modales para crear/editar y confirmaciones para eliminar
 */

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MaterialsTable } from "./materials-table"
import { MaterialsCards } from "./materials-cards"
import { MaterialForm } from "./material-form"
import { MaterialDetails } from "./material-details"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import {
  updateMaterial,
  toggleMaterialActive,
  getMaterialDetail,
} from "@/lib/materials-api"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { Material, MaterialDetailResponse, MaterialUpdateRequest } from "@/types"

interface MaterialsClientProps {
  materials: Material[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
  autoOpenId?: string
  onMaterialSelect?: (materialId: string | null) => void
  externalViewId?: string | null
}

export function MaterialsClient({ materials, autoOpenId, onMaterialSelect, externalViewId }: MaterialsClientProps) {
  const router = useRouter()
  const [localMaterials, setLocalMaterials] = useState<Material[]>(materials)
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null)
  const [selectedDetail, setSelectedDetail] = useState<MaterialDetailResponse | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Sincronizar con props
  useEffect(() => {
    setLocalMaterials(materials)
  }, [materials])

  const openDetail = async (id: string, mode: 'view' | 'edit') => {
    setSelectedMaterialId(id)
    onMaterialSelect?.(id)
    setModalMode(mode)
    setDetailLoading(true)
    try {
      const detail = await getMaterialDetail(id)
      setSelectedDetail(detail)
    } catch (error) {
      handleError(error, {
        title: 'Error al cargar el material',
      })
      setModalMode(null)
      setSelectedDetail(null)
      setSelectedMaterialId(null)
      onMaterialSelect?.(null)
    } finally {
      setDetailLoading(false)
    }
  }

  // Auto-abrir modal si se proporciona autoOpenId (desde query params)
  useEffect(() => {
    if (autoOpenId) {
      openDetail(autoOpenId, 'view')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoOpenId])

  // Abrir desde selección externa (mapa)
  useEffect(() => {
    if (externalViewId && externalViewId !== selectedMaterialId) {
      openDetail(externalViewId, 'view')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalViewId])

  const closeModal = () => {
    setModalMode(null)
    setSelectedDetail(null)
    setSelectedMaterialId(null)
    onMaterialSelect?.(null)
  }

  const handleViewDetails = (material: Material) => {
    openDetail(material.id, 'view')
  }

  const handleEditClick = (material: Material) => {
    openDetail(material.id, 'edit')
  }

  const handleEdit = async (id: string, data: MaterialUpdateRequest) => {
    setActionLoading(true)
    try {
      await updateMaterial(id, data)
      showSuccess('Material actualizado exitosamente')
      router.refresh()
      // Volver a cargar el detalle actualizado
      const refreshed = await getMaterialDetail(id)
      setSelectedDetail(refreshed)
      setModalMode('view')
    } catch (error) {
      handleError(error, {
        title: 'Error al actualizar material',
      })
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleActive = async (material: Material | MaterialDetailResponse) => {
    setActionLoading(true)
    try {
      // Actualización optimista en la lista
      setLocalMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id
            ? { ...m, isActive: !m.isActive }
            : m,
        ),
      )

      await toggleMaterialActive(material.id)
      const action = material.isActive ? 'desactivado' : 'activado'
      showSuccess(`Material ${action} exitosamente`)
      router.refresh()

      if (selectedMaterialId === material.id) {
        const refreshed = await getMaterialDetail(material.id)
        setSelectedDetail(refreshed)
      }
    } catch (error) {
      // Revertir la lista en caso de error
      setLocalMaterials((prev) =>
        prev.map((m) =>
          m.id === material.id
            ? { ...m, isActive: material.isActive }
            : m,
        ),
      )
      handleError(error, {
        title: 'Error al cambiar estado del material',
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <>
      <MaterialsTable
        materiales={localMaterials}
        onEdit={handleEditClick}
        onToggleActive={(material) => handleToggleActive(material)}
        onViewDetails={handleViewDetails}
      />
      <MaterialsCards
        materiales={localMaterials}
        onEdit={handleEditClick}
        onToggleActive={(material) => handleToggleActive(material)}
        onViewDetails={handleViewDetails}
      />

      {/* Modal para editar material */}
      {modalMode === 'edit' && selectedMaterialId && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Editar Material</h2>
              {detailLoading || !selectedDetail ? (
                <div className="py-10 flex flex-col items-center gap-3 text-sm text-muted">
                  <LoadingSpinner />
                  Cargando información…
                </div>
              ) : (
                <MaterialForm
                  material={selectedDetail}
                  onSubmit={(data) => handleEdit(selectedMaterialId, data as MaterialUpdateRequest)}
                  onCancel={closeModal}
                  isLoading={actionLoading}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {modalMode === 'view' && selectedMaterialId && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detalles del Material</h2>
              {detailLoading || !selectedDetail ? (
                <div className="py-10 flex flex-col items-center gap-3 text-sm text-muted">
                  <LoadingSpinner />
                  Cargando información…
                </div>
              ) : (
                <MaterialDetails
                  material={selectedDetail}
                  onClose={closeModal}
                  onEdit={() => setModalMode('edit')}
                  onToggleActive={() => handleToggleActive(selectedDetail)}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

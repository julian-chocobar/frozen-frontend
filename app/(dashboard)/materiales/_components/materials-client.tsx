"use client"

/**
 * Componente cliente para manejar operaciones CRUD de materiales
 * Incluye modales para crear/editar y confirmaciones para eliminar
 * 
 * Refactorizado siguiendo patrones del módulo de dashboards:
 * - Memoización de handlers con useCallback
 * - Optimización de re-renders
 * - Manejo centralizado de errores
 * 
 * @example
 * ```tsx
 * <MaterialsClient 
 *   materials={materials} 
 *   pagination={pagination}
 *   autoOpenId={searchParams.get('id')}
 * />
 * ```
 */

import { useEffect, useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { MaterialsTable } from "./materials-table"
import { MaterialsCards } from "./materials-cards"
import { MaterialForm } from "./material-form"
import { MaterialDetails } from "./material-details"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { PaginationClient } from "@/components/ui/pagination-client"
import {
  updateMaterial,
  toggleMaterialActive,
  getMaterialDetail,
} from "@/lib/materials/api"
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

export function MaterialsClient({ materials, pagination, autoOpenId, onMaterialSelect, externalViewId }: MaterialsClientProps) {
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

  const openDetail = useCallback(async (id: string, mode: 'view' | 'edit') => {
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
  }, [onMaterialSelect])

  // Auto-abrir modal si se proporciona autoOpenId (desde query params)
  useEffect(() => {
    if (autoOpenId) {
      openDetail(autoOpenId, 'view')
    }
  }, [autoOpenId, openDetail])

  // Abrir desde selección externa (mapa)
  useEffect(() => {
    if (externalViewId && externalViewId !== selectedMaterialId) {
      openDetail(externalViewId, 'view')
    }
  }, [externalViewId, selectedMaterialId, openDetail])

  const closeModal = useCallback(() => {
    setModalMode(null)
    setSelectedDetail(null)
    setSelectedMaterialId(null)
    onMaterialSelect?.(null)
  }, [onMaterialSelect])

  const handleViewDetails = useCallback((material: Material) => {
    openDetail(material.id, 'view')
  }, [openDetail])

  const handleEditClick = useCallback((material: Material) => {
    openDetail(material.id, 'edit')
  }, [openDetail])

  const handleEdit = useCallback(async (id: string, data: MaterialUpdateRequest) => {
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
  }, [router])

  const handleToggleActive = useCallback(async (material: Material | MaterialDetailResponse) => {
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
  }, [router, selectedMaterialId])

  // Memoizar el texto de paginación
  const paginationText = useMemo(() => {
    if (!pagination) return ''
    return `Mostrando ${localMaterials.length} materiales de ${pagination.totalElements} totales`
  }, [localMaterials.length, pagination])

  return (
    <>
      <div data-tour="materials-table">
        <MaterialsTable
          materiales={localMaterials}
          onEdit={handleEditClick}
          onToggleActive={handleToggleActive}
          onViewDetails={handleViewDetails}
        />
        <MaterialsCards
          materiales={localMaterials}
          onEdit={handleEditClick}
          onToggleActive={handleToggleActive}
          onViewDetails={handleViewDetails}
        />
      </div>

      {pagination && (
        <div className="mt-4 border-t border-stroke bg-primary-50/40 px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-primary-700">
            <p>{paginationText}</p>
            <PaginationClient 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          </div>
        </div>
      )}

      {/* Modal para editar material */}
      {modalMode === 'edit' && selectedMaterialId && (
        <div
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Editar Material</h2>
              {detailLoading || !selectedDetail ? (
                <div className="py-10 flex flex-col items-center gap-3 text-sm text-primary-600">
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
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Detalles del Material</h2>
              {detailLoading || !selectedDetail ? (
                <div className="py-10 flex flex-col items-center gap-3 text-sm text-primary-600">
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

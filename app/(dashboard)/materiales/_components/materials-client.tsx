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
import { 
  updateMaterial, 
  toggleMaterialActive 
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
}

export function MaterialsClient({ materials }: MaterialsClientProps) {
  const router = useRouter()
  const [localMaterials, setLocalMaterials] = useState<Material[]>(materials)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Sincronizar con props
  useEffect(() => {
    setLocalMaterials(materials)
  }, [materials])

  const handleEdit = async (id: string, data: MaterialUpdateRequest) => {
    setIsLoading(true)
    try {
      await updateMaterial(id, data)
      setIsEditing(false)
      setSelectedMaterial(null)
      showSuccess('Material actualizado exitosamente')
      setTimeout(() => router.refresh(), 500)
    } catch (error) {
      handleError(error, {
        title: 'Error al actualizar material'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (material: Material) => {
    setIsLoading(true)
    try {
      // Actualización optimista
      setLocalMaterials(prevMaterials => 
        prevMaterials.map(m => 
          m.id === material.id 
            ? { ...m, isActive: !m.isActive }
            : m
        )
      )
      
      await toggleMaterialActive(material.id)
      const action = material.isActive ? 'desactivado' : 'activado'
      showSuccess(`Material ${action} exitosamente`)
      setTimeout(() => router.refresh(), 500)
    } catch (error) {
      // Revertir en caso de error
      setLocalMaterials(prevMaterials => 
        prevMaterials.map(m => 
          m.id === material.id 
            ? { ...m, isActive: material.isActive }
            : m
        )
      )
      handleError(error, {
        title: 'Error al cambiar estado del material'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleViewDetails = (material: Material) => {
    setSelectedMaterial(material)
    setIsViewing(true)
  }

  const handleEditClick = (material: Material) => {
    setSelectedMaterial(material)
    setIsEditing(true)
  }

  return (
    <>
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

      {/* Modal para editar material */}
      {isEditing && selectedMaterial && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Editar Material</h2>
              <MaterialForm
                material={selectedMaterial}
                onSubmit={(data) => handleEdit(selectedMaterial.id, data as MaterialUpdateRequest)}
                onCancel={() => {
                  setIsEditing(false)
                  setSelectedMaterial(null)
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {isViewing && selectedMaterial && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Detalles del Material</h2>
              <MaterialDetails
                material={selectedMaterial as MaterialDetailResponse}
                onClose={() => {
                  setIsViewing(false)
                  setSelectedMaterial(null)
                }}
                onEdit={() => {
                  setIsViewing(false)
                  setIsEditing(true)
                }}
                onToggleActive={() => {
                  setIsViewing(false)
                  handleToggleActive(selectedMaterial)
                }}
              />
            </div>
          </div>
        </div>
      )}

    </>
  )
}

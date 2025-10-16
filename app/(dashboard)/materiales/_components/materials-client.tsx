"use client"

/**
 * Componente cliente para manejar operaciones CRUD de materiales
 * Incluye modales para crear/editar y confirmaciones para eliminar
 */

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MaterialsTable } from "./materials-table"
import { MaterialsCards } from "./materials-cards"
import { MaterialForm } from "./material-form"
import { MaterialDetails } from "./material-details"
import { 
  updateMaterial, 
  deleteMaterial, 
  toggleMaterialActive 
} from "@/lib/materials-api"
import type { Material, MaterialUpdateRequest } from "@/types"

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
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isViewing, setIsViewing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleEdit = async (id: string, data: MaterialUpdateRequest) => {
    setIsLoading(true)
    try {
      await updateMaterial(id, data)
      router.refresh()
      setIsEditing(false)
      setSelectedMaterial(null)
    } catch (error) {
      console.error('Error al actualizar material:', error)
      alert('Error al actualizar el material')
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleActive = async (material: Material) => {
    setIsLoading(true)
    try {
      await toggleMaterialActive(material.id)
      router.refresh()
    } catch (error) {
      console.error('Error al cambiar estado del material:', error)
      alert('Error al cambiar el estado del material')
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
        materiales={materials}
        onEdit={handleEditClick}
        onToggleActive={handleToggleActive}
        onViewDetails={handleViewDetails}
      />
      <MaterialsCards
        materiales={materials}
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
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
                material={selectedMaterial}
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

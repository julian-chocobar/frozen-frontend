"use client"

/**
 * Botón para crear nuevo material
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { MaterialForm } from "./material-form"
import { createMaterial } from "@/lib/materials/api"
import { useRouter } from "next/navigation"
import type { MaterialCreateRequest } from "@/types"

interface MaterialCreateButtonProps {
  onCreateCallback?: () => void
  /** Si true, permite editar el stock inicial (solo para casos especiales) */
  allowStockEdit?: boolean
}

export function MaterialCreateButton({ 
  onCreateCallback, 
  allowStockEdit = true 
}: MaterialCreateButtonProps) {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Material creado exitosamente',
    errorTitle: 'Error al crear material'
  })

  const handleCreate = async (data: MaterialCreateRequest) => {
    await handleSubmit(async () => {
      await createMaterial(data)
      // Pequeño delay para asegurar que el servidor procese
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Usar callback si existe, sino hacer refresh
      if (onCreateCallback) {
        onCreateCallback()
      } else {
        router.refresh()
      }
    })
  }

  return (
    <CreateButton 
      buttonText="Nuevo"
      modalTitle="Crear Nuevo Material"
      ariaLabel="Agregar nuevo material"
      isOpen={isOpen}
      onOpen={openModal}
    >
      <MaterialForm
        onSubmit={(data) => handleCreate(data as MaterialCreateRequest)}
        onCancel={closeModal}
        allowStockEdit={allowStockEdit}
        isLoading={isLoading}
      />
    </CreateButton>
  )
}
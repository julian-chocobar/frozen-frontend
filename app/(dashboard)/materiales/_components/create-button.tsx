"use client"

/**
 * Botón para crear nuevo material desde el header
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { MaterialForm } from "./material-form"
import { createMaterial } from "@/lib/materials-api"
import { useRouter } from "next/navigation"
import type { MaterialCreateRequest } from "@/types"

export function MaterialCreateButton() {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Material creado exitosamente',
    errorTitle: 'Error al crear material'
  })

  const handleCreate = async (data: MaterialCreateRequest) => {
    await handleSubmit(async () => {
      await createMaterial(data)
      router.refresh()
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
        isLoading={isLoading}
      />
    </CreateButton>
  )
}
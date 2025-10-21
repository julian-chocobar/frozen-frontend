"use client"

/**
 * Botón para crear nuevo movimiento de stock desde el header
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { MovementForm } from "./movement-form"
import { createMovement } from "@/lib/movements-api"
import { useRouter } from "next/navigation"
import type { MovementCreateRequest } from "@/types"

export function MovementCreateButton() {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Movimiento creado exitosamente',
    errorTitle: 'Error al crear movimiento'
  })

  const handleCreate = async (data: MovementCreateRequest) => {
    await handleSubmit(async () => {
      await createMovement(data)
      router.refresh()
    })
  }

  return (
    <CreateButton
      buttonText="Nuevo"
      modalTitle="Crear Nuevo Movimiento de Stock"
      ariaLabel="Agregar nuevo movimiento de stock"
      isOpen={isOpen}
      onOpen={openModal}
    >
      <MovementForm
        onSubmit={handleCreate}
        onCancel={closeModal}
        isLoading={isLoading}
      />
    </CreateButton>
  )
}

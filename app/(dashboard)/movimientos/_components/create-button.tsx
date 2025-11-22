"use client"

/**
 * Botón para crear nuevo movimiento de stock desde el header
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { MovementForm } from "./movement-form"
import { createMovement } from "@/lib/movements"
import { useRouter } from "next/navigation"
import type { MovementCreateRequest } from "@/types"

interface MovementCreateButtonProps {
  onCreateCallback?: () => void
}

export function MovementCreateButton({ onCreateCallback }: MovementCreateButtonProps) {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Movimiento creado exitosamente',
    errorTitle: 'Error al crear movimiento'
  })

  const handleCreate = async (data: MovementCreateRequest) => {
    await handleSubmit(async () => {
      await createMovement(data)
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

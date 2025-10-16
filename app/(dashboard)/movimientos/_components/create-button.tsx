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
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal()

  const handleCreate = async (data: MovementCreateRequest) => {
    await handleSubmit(async () => {
      try {
        // Crear el movimiento usando la API real
        await createMovement(data)
        
        // Actualizar la lista de movimientos después de crear
        router.refresh()
      } catch (error) {
        console.error('Error al crear movimiento:', error)
        throw error // Re-lanzar el error para que el modal lo maneje
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

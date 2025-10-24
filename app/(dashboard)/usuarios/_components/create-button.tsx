"use client"

/**
 * Botón para crear nuevo usuario desde el header
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { UserForm } from "./user-form"

export function UserCreateButton() {
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Usuario creado exitosamente',
    errorTitle: 'Error al crear usuario'
  })

  const handleCreate = async (data: any) => {
    await handleSubmit(async () => {
      // Simular creación
      await new Promise(resolve => setTimeout(resolve, 1000))
      window.location.reload()
    })
  }

  return (
    <CreateButton 
      buttonText="Nuevo"
      modalTitle="Crear Nuevo Usuario"
      ariaLabel="Agregar nuevo usuario"
      isOpen={isOpen}
      onOpen={openModal}
    >
      <UserForm
        onSubmit={handleCreate}
        onCancel={closeModal}
        isLoading={isLoading}
      />
    </CreateButton>
  )
}


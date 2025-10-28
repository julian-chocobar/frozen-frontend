"use client"

/**
 * Botón para crear nuevo usuario desde el header
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { UserForm } from "./user-form"
import { createUser } from "@/lib/users-api"
import { useRouter } from "next/navigation"
import type { UserCreateRequest } from "@/types"

export function UserCreateButton() {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Usuario creado exitosamente',
    errorTitle: 'Error al crear usuario'
  })

  const handleCreate = async (data: UserCreateRequest) => {
    await handleSubmit(async () => {
      await createUser(data)
      router.refresh()
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
        onSubmit={(data) => handleCreate(data as UserCreateRequest)}
        onCancel={closeModal}
        isLoading={isLoading}
      />
    </CreateButton>
  )
}


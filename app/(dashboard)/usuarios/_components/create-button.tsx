"use client"

/**
 * Botón para crear nuevo usuario
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { UserForm } from "./user-form"
import { createUser } from "@/lib/users-api"
import { useRouter } from "next/navigation"
import type { UserCreateRequest } from "@/types"

interface UserCreateButtonProps {
  onCreateCallback?: () => void // Callback opcional para refrescar después de crear
}

export function UserCreateButton({ onCreateCallback }: UserCreateButtonProps) {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Usuario creado exitosamente',
    errorTitle: 'Error al crear usuario'
  })

  const handleCreate = async (data: UserCreateRequest) => {
    await handleSubmit(async () => {
      await createUser(data)
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


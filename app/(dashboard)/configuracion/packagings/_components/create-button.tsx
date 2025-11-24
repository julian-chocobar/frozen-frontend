"use client"
import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { PackagingForm } from "./packaging-form"
import { createPackaging } from "@/lib/packagings"
import { useRouter } from "next/navigation"
import type { PackagingCreateRequest } from "@/types"

interface PackagingCreateButtonProps {
  onCreateCallback?: () => void
}

export function PackagingCreateButton({ onCreateCallback }: PackagingCreateButtonProps) {
    const router = useRouter()
    const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
        successMessage: 'Packaging creado exitosamente',
        errorTitle: 'Error al crear packaging'
    })

    const handleCreate = async (data: PackagingCreateRequest) => {
        await handleSubmit(async () => {
            await createPackaging(data)
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
            modalTitle="Crear Nuevo Packaging"
            ariaLabel="Agregar nuevo packaging"
            isOpen={isOpen}
            onOpen={openModal}
        >
            <PackagingForm
                onSubmit={handleCreate}
                onCancel={closeModal}
                isLoading={isLoading}
            />
        </CreateButton>
    )
}
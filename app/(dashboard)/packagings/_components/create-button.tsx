"use client"
import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { PackagingForm } from "./packaging-form"
import { createPackaging } from "@/lib/packagings-api"
import { useRouter } from "next/navigation"
import type { PackagingCreateRequest } from "@/types"

export function PackagingCreateButton() {
    const router = useRouter()
    const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
        successMessage: 'Packaging creado exitosamente',
        errorTitle: 'Error al crear packaging'
    })

    const handleCreate = async (data: PackagingCreateRequest) => {
        await handleSubmit(async () => {
            await createPackaging(data)
            router.refresh()
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
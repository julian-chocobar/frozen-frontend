"use client"
import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { PackagingForm } from "./packaging-form"
import { createPackaging } from "@/lib/packagings-api"
import { useRouter } from "next/navigation"
import type { PackagingCreateRequest } from "@/types"

export function PackagingCreateButton() {
    const router = useRouter()
    const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal()

    const handleCreate = async (data: PackagingCreateRequest) => {
        await handleSubmit(async () => {
            try {
                await createPackaging(data)
                router.refresh()
            } catch (error) {
                console.error('Error al crear packaging:', error)
                throw error
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
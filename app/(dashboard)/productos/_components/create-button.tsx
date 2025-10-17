"use client"

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { ProductForm } from "./product-form"
import { createProduct } from "@/lib/products-api"
import { useRouter } from "next/navigation"
import type { ProductCreateRequest } from "@/types"

export function ProductCreateButton() {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal()

  const handleCreate = async (data: ProductCreateRequest) => {
    await handleSubmit(async () => {
      await createProduct(data)
      router.refresh()
    })
  }

  return (
    <CreateButton 
      buttonText="Nuevo"
      modalTitle="Crear Nuevo Producto"
      ariaLabel="Agregar nuevo producto"
      isOpen={isOpen}
      onOpen={openModal}
    >
      <ProductForm onSubmit={handleCreate} onCancel={closeModal} isLoading={isLoading} />
    </CreateButton>
  )
}
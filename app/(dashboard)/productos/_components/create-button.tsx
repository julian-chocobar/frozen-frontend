"use client"

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { ProductForm } from "./product-form"
import { createProduct } from "@/lib/products-api"
import { useRouter } from "next/navigation"
import type { ProductCreateRequest } from "@/types"

interface ProductCreateButtonProps {
  onCreateCallback?: () => void
}

export function ProductCreateButton({ onCreateCallback }: ProductCreateButtonProps) {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Producto creado exitosamente',
    errorTitle: 'Error al crear producto'
  })

  const handleCreate = async (data: ProductCreateRequest) => {
    await handleSubmit(async () => {
      const product = await createProduct(data)
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

  const handleComplete = async (data: ProductCreateRequest) => {
    await handleSubmit(async () => {
      const product = await createProduct(data)
      router.push(`/productos/${product.id}`)
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
      <ProductForm 
        onSubmit={handleCreate} 
        onCancel={closeModal} 
        isLoading={isLoading}
        onComplete={handleComplete}
      />
    </CreateButton>
  )
}
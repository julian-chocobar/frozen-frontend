"use client"

/**
 * Botón para crear nueva orden de producción desde el header
 * Usa el componente genérico CreateButton
 */

import { CreateButton, useCreateModal } from "@/components/ui/create-button"
import { OrderForm } from "./order-form"
import { createProductionOrder } from "@/lib/production-orders-api"
import { useRouter } from "next/navigation"
import type { ProductionOrderCreateRequest } from "@/types"

interface OrderCreateButtonProps {
  onCreateCallback?: () => void
}

export function OrderCreateButton({ onCreateCallback }: OrderCreateButtonProps) {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Orden de producción creada exitosamente',
    errorTitle: 'Error al crear orden de producción'
  })

  const handleCreate = async (data: ProductionOrderCreateRequest) => {
    await handleSubmit(async () => {
      await createProductionOrder(data)
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
      buttonText="Nueva"
      modalTitle="Crear Nueva Orden de Producción"
      ariaLabel="Agregar nueva orden de producción"
      isOpen={isOpen}
      onOpen={openModal}
    >
      <OrderForm
        onSubmit={handleCreate}
        onCancel={closeModal}
        isLoading={isLoading}
      />
    </CreateButton>
  )
}

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

export function OrderCreateButton() {
  const router = useRouter()
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal({
    successMessage: 'Orden de producción creada exitosamente',
    errorTitle: 'Error al crear orden de producción'
  })

  const handleCreate = async (data: ProductionOrderCreateRequest) => {
    await handleSubmit(async () => {
      await createProductionOrder(data)
      router.refresh()
    })
  }

  return (
    <CreateButton
      buttonText="Nueva Orden"
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

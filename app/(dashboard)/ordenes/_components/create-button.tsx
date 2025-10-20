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
  const { isOpen, isLoading, openModal, closeModal, handleSubmit } = useCreateModal()

  const handleCreate = async (data: ProductionOrderCreateRequest) => {
    await handleSubmit(async () => {
      try {
        // Crear la orden usando la API real
        await createProductionOrder(data)
        
        // Actualizar la lista de órdenes después de crear
        router.refresh()
      } catch (error) {
        console.error('Error al crear orden:', error)
        throw error // Re-lanzar el error para que el modal lo maneje
      }
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

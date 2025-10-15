"use client"

/**
 * Botón para crear nuevo material desde el header
 */

import { useState } from "react"
import { Plus } from "lucide-react"
import { MaterialForm } from "./material-form"
import { createMaterial } from "@/lib/materials-api"
import { useRouter } from "next/navigation"
import type { MaterialCreateRequest } from "@/types"

export function CreateButton() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async (data: MaterialCreateRequest) => {
    setIsLoading(true)
    try {
      await createMaterial(data)
      router.refresh() // Recargar la página para mostrar los nuevos datos
      setIsCreating(false)
    } catch (error) {
      console.error('Error al crear material:', error)
      alert('Error al crear el material')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsCreating(true)}
        className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 min-w-[40px] sm:min-w-auto"
        aria-label="Agregar nuevo material"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">Nuevo</span>
      </button>

      {/* Modal para crear material */}
      {isCreating && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Crear Nuevo Material</h2>
              <MaterialForm
                onSubmit={(data) => handleCreate(data as MaterialCreateRequest)}
                onCancel={() => setIsCreating(false)}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

"use client"

/**
 * Componente genérico para botones de creación con modal
 * Reutilizable para diferentes tipos de entidades (materiales, movimientos, etc.)
 */

import { ReactNode, useState } from "react"
import { Plus } from "lucide-react"

interface CreateButtonProps {
  /** Texto del botón en pantallas grandes */
  buttonText?: string
  /** Texto del modal */
  modalTitle: string
  /** Contenido del modal (formulario) */
  children: ReactNode
  /** Texto del aria-label para accesibilidad */
  ariaLabel?: string
  /** Clases CSS adicionales para el botón */
  className?: string
  /** Clases CSS adicionales para el modal */
  modalClassName?: string
  /** Tamaño máximo del modal */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl"
  /** Estado del modal desde el hook */
  isOpen: boolean
  /** Función para abrir el modal */
  onOpen: () => void
}

export function CreateButton({
  buttonText = "Nuevo",
  modalTitle,
  children,
  ariaLabel,
  className = "",
  modalClassName = "",
  maxWidth = "2xl",
  isOpen,
  onOpen
}: CreateButtonProps) {
  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md", 
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl"
  }

  return (
    <>
      <button
        onClick={onOpen}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 min-w-[40px] sm:min-w-auto ${className}`}
        aria-label={ariaLabel || `Agregar nuevo ${buttonText.toLowerCase()}`}
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="hidden sm:inline">{buttonText}</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className={`bg-white rounded-lg ${maxWidthClasses[maxWidth]} w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 ${modalClassName}`}>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">{modalTitle}</h2>
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * Hook para manejar el estado del modal de creación
 */
export function useCreateModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  const handleSubmit = async (submitFn: () => Promise<void>) => {
    setIsLoading(true)
    try {
      await submitFn()
      closeModal()
    } catch (error) {
      console.error('Error en la operación:', error)
      // El error específico debe ser manejado por el componente padre
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isOpen,
    isLoading,
    openModal,
    closeModal,
    handleSubmit
  }
}

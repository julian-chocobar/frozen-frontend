"use client"

/**
 * Componente cliente para manejar operaciones CRUD de movimientos
 * Incluye modales para crear/editar y confirmaciones para eliminar
 */

import { useState, useEffect } from "react"
import { MovementsTable } from "./movements-table"
import { MovementsCards } from "./movements-cards"
import { MovementDetails } from "./movement-details"
import { getMovementById, toggleMovementInProgress, completeMovement } from "@/lib/movements-api"
import { handleError, showSuccess } from "@/lib/error-handler"


import type { MovementResponse, MovementDetailResponse } from "@/types"

interface MovementsClientProps {
  movements: MovementResponse[]
  pagination: {
    currentPage: number
    totalPages: number
    totalElements: number
    size: number
    first: boolean
    last: boolean
  }
  autoOpenDetailId?: string
}

export function MovementsClient({ movements, autoOpenDetailId }: MovementsClientProps) {
  const [selectedMovement, setSelectedMovement] = useState<MovementDetailResponse | null>(null)
  const [isViewing, setIsViewing] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [processingAction, setProcessingAction] = useState<string | null>(null)

  // Auto-abrir modal si se proporciona un ID
  useEffect(() => {
    if (autoOpenDetailId && !isViewing) {
      const movement = movements.find(m => m.id === autoOpenDetailId)
      if (movement) {
        handleViewDetails(movement)
      }
    }
  }, [autoOpenDetailId, movements, isViewing])

  const handleViewDetails = async (movement: MovementResponse) => {
    setLoadingDetails(true)
    setIsViewing(true)
    
    try {
      const movementDetails = await getMovementById(movement.id)
      setSelectedMovement(movementDetails as unknown as MovementDetailResponse)
    } catch (error) {
      handleError(error, {
        title: 'Error al cargar detalles del movimiento'
      })
      setIsViewing(false)
    } finally {
      setLoadingDetails(false)
    }
  }

  const handleToggleInProgress = async (movement: MovementResponse) => {
    if (processingAction) return
    
    setProcessingAction(movement.id)
    try {
      await toggleMovementInProgress(movement.id)
      showSuccess(
        movement.status === 'PENDIENTE' 
          ? 'Movimiento marcado como en proceso'
          : 'Movimiento marcado como pendiente'
      )
      // Recargar página para actualizar los datos
      window.location.reload()
    } catch (error) {
      handleError(error, {
        title: 'Error al cambiar estado del movimiento'
      })
    } finally {
      setProcessingAction(null)
    }
  }

  const handleCompleteMovement = async (movement: MovementResponse) => {
    if (processingAction) return
    
    setProcessingAction(movement.id)
    try {
      await completeMovement(movement.id)
      showSuccess('Movimiento completado exitosamente')
      // Recargar página para actualizar los datos
      window.location.reload()
    } catch (error) {
      handleError(error, {
        title: 'Error al completar movimiento'
      })
    } finally {
      setProcessingAction(null)
    }
  }

  return (
    <div>
      <MovementsTable 
        movements={movements} 
        onViewDetails={handleViewDetails}
        onToggleInProgress={handleToggleInProgress}
        onCompleteMovement={handleCompleteMovement} />
      <MovementsCards 
        movements={movements} 
        onViewDetails={handleViewDetails}
        onToggleInProgress={handleToggleInProgress}
        onCompleteMovement={handleCompleteMovement} />

      {/* Modal para ver detalles */}
      {isViewing && (
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
              {loadingDetails ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-primary-600">Cargando detalles...</span>
                </div>
              ) : selectedMovement ? (
                <MovementDetails
                  movement={selectedMovement}
                  onClose={() => {
                    setIsViewing(false)
                    setSelectedMovement(null)
                  }}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-red-600">Error al cargar los detalles del movimiento</p>
                  <button
                    onClick={() => {
                      setIsViewing(false)
                      setSelectedMovement(null)
                    }}
                    className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

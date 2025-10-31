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
  autoOpenId?: string
}

export function MovementsClient({ movements, autoOpenId }: MovementsClientProps) {
  const [selectedMovement, setSelectedMovement] = useState<MovementDetailResponse | null>(null)
  const [isViewing, setIsViewing] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  // Auto-abrir modal si se proporciona autoOpenId
  useEffect(() => {
    if (autoOpenId && movements.length > 0) {
      const targetMovement = movements.find(m => m.id === autoOpenId)
      if (targetMovement) {
        handleViewDetails(targetMovement)
      }
    }
  }, [autoOpenId, movements])

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

  const handleToggleInProgress = async (id: string) => {
    if (!selectedMovement) return

    setIsLoadingAction(true)
    try {
      await toggleMovementInProgress(id)
      
      // Refresh movement details
      const updatedMovement = await getMovementById(id)
      setSelectedMovement(updatedMovement as unknown as MovementDetailResponse)
      
      showSuccess('Estado del movimiento actualizado')
    } catch (error) {
      handleError(error, {
        title: 'Error al actualizar estado del movimiento'
      })
    } finally {
      setIsLoadingAction(false)
    }
  }

  const handleComplete = async (id: string) => {
    if (!selectedMovement) return

    setIsLoadingAction(true)
    try {
      await completeMovement(id)
      
      // Refresh movement details
      const updatedMovement = await getMovementById(id)
      setSelectedMovement(updatedMovement as unknown as MovementDetailResponse)
      
      showSuccess('Movimiento completado exitosamente')
    } catch (error) {
      handleError(error, {
        title: 'Error al completar movimiento'
      })
    } finally {
      setIsLoadingAction(false)
    }
  }

  return (
    <div>
      <MovementsTable 
        movements={movements} 
        onViewDetails={handleViewDetails} />
      <MovementsCards 
        movements={movements} 
        onViewDetails={handleViewDetails} />

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
                  onToggleInProgress={handleToggleInProgress}
                  onComplete={handleComplete}
                  isLoading={isLoadingAction}
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

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
import { PaginationClient } from "@/components/ui/pagination-client"
import { Button } from "@/components/ui/button"


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

export function MovementsClient({ movements, pagination, autoOpenId }: MovementsClientProps) {
  const [localMovements, setLocalMovements] = useState<MovementResponse[]>(movements)
  const [selectedMovement, setSelectedMovement] = useState<MovementDetailResponse | null>(null)
  const [isViewing, setIsViewing] = useState(false)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [isLoadingAction, setIsLoadingAction] = useState(false)

  // Actualizar localMovements cuando cambien los props
  useEffect(() => {
    setLocalMovements(movements)
  }, [movements])

  // Auto-abrir modal si se proporciona autoOpenId
  useEffect(() => {
    console.log('MovementsClient autoOpenId effect:', { autoOpenId, movementsCount: movements.length })
    if (autoOpenId && movements.length > 0) {
      console.log('Looking for movement with id:', autoOpenId)
      console.log('Available movements:', movements.map(m => ({ id: m.id, type: m.type })))
      const targetMovement = movements.find(m => m.id === autoOpenId)
      console.log('Found target movement:', targetMovement)
      if (targetMovement) {
        console.log('Opening modal for movement:', targetMovement.id)
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
      
      // Actualizar el estado local de la lista de movimientos
      setLocalMovements(prevMovements => 
        prevMovements.map(m => 
          m.id === id 
            ? { 
                ...m, 
                status: m.status === "EN_PROCESO" ? "PENDIENTE" : "EN_PROCESO"
              }
            : m
        )
      )
      
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
      
      // Actualizar el estado local de la lista de movimientos
      setLocalMovements(prevMovements => 
        prevMovements.map(m => 
          m.id === id 
            ? { 
                ...m, 
                status: "COMPLETADO",
                realizationDate: new Date().toISOString()
              }
            : m
        )
      )
      
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
        movements={localMovements} 
        onViewDetails={handleViewDetails} />
      <MovementsCards 
        movements={localMovements} 
        onViewDetails={handleViewDetails} />

      {pagination && (
        <div className="mt-4 border-t border-stroke bg-primary-50/40 px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-primary-700">
            <p>
              Mostrando {localMovements.length} movimientos de {pagination.totalElements} totales
            </p>
            <PaginationClient 
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
            />
          </div>
        </div>
      )}

      {/* Modal para ver detalles */}
      {isViewing && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50"
          style={{ 
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        >
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-primary-200">
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
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewing(false)
                      setSelectedMovement(null)
                    }}
                    className="mt-4 border-primary-300 text-primary-600 hover:bg-primary-50"
                  >
                    Cerrar
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

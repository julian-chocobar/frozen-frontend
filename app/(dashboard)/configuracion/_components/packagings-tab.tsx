"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { getPackagings } from "@/lib/packagings"
import { PackagingsTable } from "@/app/(dashboard)/packagings/_components/packagings-table"
import { PackagingsCards } from "@/app/(dashboard)/packagings/_components/packagings-cards"
import { PackagingForm } from "@/app/(dashboard)/packagings/_components/packaging-form"
import { PackagingCreateButton } from "@/app/(dashboard)/packagings/_components/create-button"
import { 
  updatePackaging, 
  togglePackagingActive 
} from "@/lib/packagings"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { PackagingResponse, PackagingUpdateRequest } from "@/types"
import { PackagingsLoadingState } from "@/components/packagings/packagings-loading-state"
import { PackagingsErrorState } from "@/components/packagings/packagings-error-state"
import { PACKAGING_PAGINATION } from "@/lib/constants"

export function PackagingsTab() {
  const router = useRouter()
  const [packagings, setPackagings] = useState<PackagingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingResponse | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [isRetrying, setIsRetrying] = useState(false)

  const loadPackagings = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getPackagings({ 
        page: 0, 
        size: PACKAGING_PAGINATION.DEFAULT_PAGE_SIZE 
      })
      setPackagings(data.packagings)
    } catch (err) {
      console.error('Error al cargar packagings:', err)
      setError('No se pudieron cargar los packagings')
    } finally {
      setLoading(false)
      setIsRetrying(false)
    }
  }, [])

  useEffect(() => {
    loadPackagings()
  }, [loadPackagings, refreshKey])

  const handleRefresh = useCallback(() => {
    setRefreshKey(prev => prev + 1)
  }, [])

  const handleRetry = useCallback(() => {
    setIsRetrying(true)
    handleRefresh()
  }, [handleRefresh])

  const handleEdit = async (id: string, data: PackagingUpdateRequest) => {
    setIsSaving(true)
    try {
      await updatePackaging(id, data)
      setIsEditing(false)
      setSelectedPackaging(null)
      showSuccess('Packaging actualizado exitosamente')
      setTimeout(() => handleRefresh(), 500)
    } catch (error) {
      handleError(error, {
        title: 'Error al actualizar packaging'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleActive = async (packaging: PackagingResponse) => {
    setIsSaving(true)
    try {
      // Actualización optimista
      setPackagings(prevPackagings => 
        prevPackagings.map(p => 
          p.id === packaging.id 
            ? { ...p, isActive: !p.isActive }
            : p
        )
      )
      
      await togglePackagingActive(packaging.id)
      const action = packaging.isActive ? 'desactivado' : 'activado'
      showSuccess(`Packaging ${action} exitosamente`)
      setTimeout(() => handleRefresh(), 500)
    } catch (error) {
      // Revertir en caso de error
      setPackagings(prevPackagings => 
        prevPackagings.map(p => 
          p.id === packaging.id 
            ? { ...p, isActive: packaging.isActive }
            : p
        )
      )
      handleError(error, {
        title: 'Error al cambiar estado del packaging'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditClick = (packaging: PackagingResponse) => {
    setSelectedPackaging(packaging)
    setIsEditing(true)
  }

  return (
    <>
      <div className="card border-2 border-primary-600 overflow-hidden">
        <div className="p-6 border-b border-stroke">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-primary-900 mb-1">Packagings</h2>
              <p className="text-sm text-primary-600">Gestiona latas, botellas y otros envases</p>
            </div>
            {!loading && !error && (
              <PackagingCreateButton onCreateCallback={handleRefresh} />
            )}
          </div>
        </div>

        {error ? (
          <PackagingsErrorState 
            message={error}
            onRetry={handleRetry}
            isRetrying={isRetrying}
          />
        ) : loading ? (
          <div className="p-6">
            <PackagingsLoadingState count={PACKAGING_PAGINATION.DEFAULT_PAGE_SIZE} />
          </div>
        ) : (
          <>
            <PackagingsTable
              packagings={packagings}
              onEdit={handleEditClick}
              onToggleActive={handleToggleActive}
            />
            <PackagingsCards
              packagings={packagings}
              onEdit={handleEditClick}
              onToggleActive={handleToggleActive}
            />
          </>
        )}
      </div>

      {/* Modal para editar packaging */}
      {isEditing && selectedPackaging && (
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
              <h2 className="text-xl font-semibold text-primary-900 mb-4">Editar Packaging</h2>
              <PackagingForm
                packaging={selectedPackaging}
                onSubmit={(data) => handleEdit(selectedPackaging.id, data as PackagingUpdateRequest)}
                onCancel={() => {
                  setIsEditing(false)
                  setSelectedPackaging(null)
                }}
                isLoading={isSaving}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}


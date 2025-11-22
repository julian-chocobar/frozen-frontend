"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PackagingsTable } from "./packagings-table"
import { PackagingsCards } from "./packagings-cards"
import { PackagingForm } from "./packaging-form"
import { 
  updatePackaging, 
  togglePackagingActive 
} from "@/lib/packagings"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { PackagingResponse, PackagingUpdateRequest } from "@/types"
import { PaginationClient } from "@/components/ui/pagination-client"

interface PackagingsClientProps {
    packagings: PackagingResponse[]
    pagination: {
        currentPage: number
        totalPages: number
        totalElements: number
        size: number
        first: boolean
        last: boolean
    }
}

export function PackagingsClient({ packagings, pagination }: PackagingsClientProps) {
    const router = useRouter()
    const [localPackagings, setLocalPackagings] = useState<PackagingResponse[]>(packagings)
    const [selectedPackaging, setSelectedPackaging] = useState<PackagingResponse | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // Sincronizar con props
    useEffect(() => {
        setLocalPackagings(packagings)
    }, [packagings])

    const handleEdit = async (id: string, data: PackagingUpdateRequest) => {
        setIsLoading(true)
        try {
            await updatePackaging(id, data)
            setIsEditing(false)
            setSelectedPackaging(null)
            showSuccess('Packaging actualizado exitosamente')
            setTimeout(() => router.refresh(), 500)
        } catch (error) {
            handleError(error, {
                title: 'Error al actualizar packaging'
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleActive = async (packaging: PackagingResponse) => {
        setIsLoading(true)
        try {
            // Actualización optimista
            setLocalPackagings(prevPackagings => 
                prevPackagings.map(p => 
                    p.id === packaging.id 
                        ? { ...p, isActive: !p.isActive }
                        : p
                )
            )
            
            await togglePackagingActive(packaging.id)
            const action = packaging.isActive ? 'desactivado' : 'activado'
            showSuccess(`Packaging ${action} exitosamente`)
            setTimeout(() => router.refresh(), 500)
        } catch (error) {
            // Revertir en caso de error
            setLocalPackagings(prevPackagings => 
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
            setIsLoading(false)
        }
    }

    const handleEditClick = (packaging: PackagingResponse) => {
        setSelectedPackaging(packaging)
        setIsEditing(true)
    }

    return (
        <>
            <PackagingsTable
                packagings={localPackagings}
                onEdit={handleEditClick}
                onToggleActive={handleToggleActive}
            />
            <PackagingsCards
                packagings={localPackagings}
                onEdit={handleEditClick}
                onToggleActive={handleToggleActive}
            />

            {pagination && (
                <div className="mt-4 border-t border-stroke bg-primary-50/40 px-4 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-sm text-primary-700">
                        <p>
                            Mostrando {localPackagings.length} packagings de {pagination.totalElements} totales
                        </p>
                        <PaginationClient 
                            currentPage={pagination.currentPage}
                            totalPages={pagination.totalPages}
                        />
                    </div>
                </div>
            )}

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
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
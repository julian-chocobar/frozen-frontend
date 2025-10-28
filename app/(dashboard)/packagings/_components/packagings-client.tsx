"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { PackagingsTable } from "./packagings-table"
import { PackagingsCards } from "./packagings-cards"
import { PackagingForm } from "./packaging-form"
import { 
  updatePackaging, 
  togglePackagingActive 
} from "@/lib/packagings-api"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { PackagingResponse, PackagingUpdateRequest } from "@/types"

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

            {/* Modal para editar packaging */}
            {isEditing && selectedPackaging && (
                <div 
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                >
                    <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Editar Packaging</h2>
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